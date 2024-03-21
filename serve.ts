#!/usr/bin/env ts-node
import BuildServe, {TransformOptions} from "ts-node-build"
import {program} from "commander"
;(async ()=>{
    try {
        program
            .showHelpAfterError()
            .showSuggestionAfterError()
            .usage("[global options] command")
            .option("-c, --cwd <path>","当前工作目录", process.cwd())
            .option("-f, --files <files>","工作目录", '!(node_modules|.git|.idea|.DS_Store|dist|build|unit_test)/**/**')
            .option("-v, --versions","版本信息")
            .parse()
        const options =  program.opts()
        if(options.versions){
            console.log(require('./package.json').version)
            return
        }
        let result = 0;
        await new BuildServe ({
            isOutInfo:false,
            inputFiles:[options.files],
            isOutDir:false,
            inputFilesOptions:{
                absolute:true
            },
            cwd:options.cwd,
            rules:[
                {
                    rule:/./,
                    transform({code, file}: TransformOptions): Promise<string | void> | string | void {
                        if(!/\.(png|svg|ttf|otf|woff|woff2|jpg|jpeg|gif)$/.test(file)){
                            // console.log(file, code.split('\n').length)
                            result += code.split('\n').length
                        }
                        return code
                    }
                }
            ],
            onError(error: Error): Promise<any> | void {
                console.log((this as Error).message)
            }
        }).compile()
        console.log("代码总行数",result)
        if(Object.keys(program.opts()).length === 0){
            program.help()
        }
    }catch (e:any) {
        console.error(e)
        program.help()
    }


})()
