import { AgentResult, TextMessage } from "@inngest/agent-kit";




export const lastMessage =(result : AgentResult)=>{
const messageIndex = result.output.findLastIndex(
  (message)=>message.role === 'assistant'
)

if(messageIndex === -1){
  return null
}

const message= result.output[messageIndex] as TextMessage | undefined
  return message?.content ? typeof message.content ==='string'? message.content : message.content.map(b=>b.text).join(''):undefined
}