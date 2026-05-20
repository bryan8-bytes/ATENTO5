import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import traverseModule from '@babel/traverse';
import generatorModule from '@babel/generator';
import * as t from '@babel/types';

const traverse = traverseModule.default;
const generate = generatorModule.default;

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    
    try {
        const ast = parser.parse(code, {
            sourceType: 'module',
            plugins: ['jsx']
        });

        let changed = false;

        traverse(ast, {
            JSXOpeningElement(path) {
                const nameNode = path.node.name;
                if (!(t.isJSXMemberExpression(nameNode) && nameNode.object.name === 'motion') &&
                    !(t.isJSXIdentifier(nameNode) && nameNode.name.startsWith('motion'))) return;

                let transitionAttrPath = null;
                let targetAttrPath = null;
                let whileHoverAttrPath = null;
                
                path.get('attributes').forEach(attrPath => {
                    if (!t.isJSXAttribute(attrPath.node)) return;
                    const attrName = attrPath.node.name.name;
                    if (attrName === 'transition') transitionAttrPath = attrPath;
                    if (attrName === 'whileInView' || attrName === 'animate') targetAttrPath = attrPath;
                    if (attrName === 'whileHover') whileHoverAttrPath = attrPath;
                });

                if (transitionAttrPath && targetAttrPath && whileHoverAttrPath) {
                    const transitionExpr = transitionAttrPath.node.value.expression;
                    if (t.isObjectExpression(transitionExpr)) {
                        // We check if transition has 'delay' inside it
                        const delayPropIndex = transitionExpr.properties.findIndex(
                            prop => t.isObjectProperty(prop) && t.isIdentifier(prop.key, { name: 'delay' })
                        );
                        
                        if (delayPropIndex !== -1) {
                            if (t.isObjectExpression(targetAttrPath.node.value.expression)) {
                                const targetExpr = targetAttrPath.node.value.expression;
                                
                                const hasTransition = targetExpr.properties.some(
                                    prop => t.isObjectProperty(prop) && t.isIdentifier(prop.key, { name: 'transition' })
                                );
                                
                                if (!hasTransition) {
                                    targetExpr.properties.push(
                                        t.objectProperty(t.identifier('transition'), t.cloneNode(transitionExpr))
                                    );
                                    
                                    transitionAttrPath.remove();
                                    changed = true;
                                }
                            }
                        }
                    }
                }
            }
        });

        if (changed) {
            const output = generate(ast, { retainLines: false, jsescOption: { minimal: true } }, code);
            fs.writeFileSync(file, output.code);
            changedFiles++;
            console.log("AST fixed delay unhover in", file);
        }
    } catch(e) {
        // Just skip files that fail parsing
    }
});
console.log("Done fixing AST delays. Changed:", changedFiles);
