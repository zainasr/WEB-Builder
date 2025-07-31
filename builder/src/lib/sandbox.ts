import Sandbox from "@e2b/code-interpreter"

export const getSandbox = async(sandboxId:string)=>{
    const sandbox = await Sandbox.connect(sandboxId);
    await sandbox.setTimeout(60000 * 10 * 3)
    return sandbox
}