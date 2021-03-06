import {Node} from "acorn";
import fs from 'fs';
import path from 'path';
import {PROJECT_ROOT} from "../../constants/DirectoryStructureConstants";
import {extractPageDetails, extractPageInfo} from "./PageDetailsExtractor";
import {PageDetails} from "../../api-models/PageDetails";
import {Page} from "../../api-models/Page";
import AcornParser from "../../core/AcornParser";

const fsp = fs.promises;

export async function getProjectPages(projectId): Promise<any[]> {
    const projectDir = path.join(PROJECT_ROOT, projectId, 'pages');
    // console.log("projectDir", projectDir);
    return await fsp.readdir(projectDir).then((files) => {
        //listing all files using forEach
        return files.filter(file => !file.startsWith('_') && file.endsWith('.js')).map(file => {
            const slug = file.replace('.js', '');
            return getProjectPageInfo(projectId, slug).then((page)=>page);
        });
    }).catch((err) => {
        console.log('Unable to scan directory: ' + err);
        return [];
    });
}

export async function getProjectPageInfo(projectId, page): Promise<any> {
    const filePath = path.join(PROJECT_ROOT, projectId, 'pages', `${page}.js`);
    // console.log("filePath", filePath);
    return await fsp.readFile(filePath, 'utf8')
        .then((srcCode) => {
            const ast: Node = AcornParser.parse(srcCode);
            return extractPageInfo(ast, projectId, page);
        })
        .catch((err) => {
            console.log("File read failed:", err);
            return new Page({});
        });
}


export async function getProjectPageDetails(projectId, page): Promise<PageDetails> {
    const filePath = path.join(PROJECT_ROOT, projectId, 'pages', `${page}.js`);
    // console.log("filePath", filePath);
    return await fsp.readFile(filePath, 'utf8')
        .then((srcCode) => {
            const ast: Node = AcornParser.parse(srcCode);
            return extractPageDetails(ast, page);
        })
        .catch((err) => {
            console.log("File read failed:", err);
            return new PageDetails();
        });
}

export async function getProjectPageSourceCode(projectId, page): Promise<string> {
    const filePath = path.join(PROJECT_ROOT, projectId, 'pages', `${page}.js`);
    // console.log("filePath", filePath);
    return await fsp.readFile(filePath, 'utf8')
        .then((srcCode) => srcCode)
        .catch((err) => {
            console.log("File read failed:", err);
            return "";
        });
}
