const { BedrockRuntimeClient, ConverseStreamCommand } = require("@aws-sdk/client-bedrock-runtime");
const { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand, ListSessionsCommand  } = require("@aws-sdk/client-bedrock-agent-runtime");

// converse stream command client
// const client = new BedrockRuntimeClient({ region: "us-west-2" });

// RAG command client
const client = new BedrockAgentRuntimeClient({ region: "us-west-2" });

// RAG with streaming client ad import ... here the import is same as the normal RAG client
const { RetrieveAndGenerateStreamCommand } = require("@aws-sdk/client-bedrock-agent-runtime"); // CommonJS import
const client_rag_stream = new BedrockAgentRuntimeClient({ region: "us-west-2" });



class BedrockChatUtils {
    constructor(config) {
    }

    async sendRequest(req_data) {
        // console.log("chat request by user :", req_data)
        try {
            let final_response = ``;
            const conversation = [
                {
                    role: "user",
                    content: [{ text: req_data.message.message }],
                }
            ];

            // Define model ID and conversation
            // const modelId = "anthropic.claude-3-sonnet-20240229-v1:0";
            const modelId = "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0";
            // Configure inference parameters
            const inferenceConfig = {
                maxTokens: 1000,
                temperature: 0.7,
                topP: 0.9,
            };
            // Create ConverseStreamCommand
            const command = new ConverseStreamCommand({
                modelId,
                messages: conversation,
                inferenceConfig,
            });
            // Send the command and handle streaming response
            try {
                // console.log("sending the command to the model", command);
                let response = await client.send(command);
                // console.log("completed response", response);
                for await (const item of response.stream) {
                    console.log("item", item);
                    if (item.contentBlockDelta) {
                        console.log("item content block delta", item.contentBlockDelta.delta?.text);
                        // process.stdout.write(item.contentBlockDelta.delta?.text);
                        final_response += item.contentBlockDelta.delta?.text;
                        // yield item.contentBlockDelta.delta?.text;
                    }
                }
                // console.log("requested message: ", req_data.message.message, "\nresponse: ", final_response);
                return final_response;
            } catch (err) {
                console.error("Error invoking bedrock:", err);
            }
        } catch (err) {
            // console.log("err captured during streaming the message:", err)
            console.log("error code ", err.code)
            // console.log("error message: ", err.message)
        }
    }

    async sendRequestRAG(req_data) {
        // console.log("chat request by user :", req_data)
        try {
            let final_response = ``;
            // Define model ID and conversation
            // const modelId = "anthropic.claude-3-sonnet-20240229-v1:0";
            const modelId = "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0";
            let kb_id = "ZTNXRBLX1J"
            // Send the command and handle streaming response
            try {
                const command = new RetrieveAndGenerateCommand({
                    // sessionId : req_data.message.unique_id,
                    input: { text: req_data.message.message },
                    retrieveAndGenerateConfiguration: {
                        type: "KNOWLEDGE_BASE",
                        knowledgeBaseConfiguration: {
                            knowledgeBaseId: kb_id,
                            modelArn: modelId,
                        }
                    }
                });
                const response = await client.send(command);

                final_response = response.output.text;
                // console.log("Response of the command to the model", response);
                // console.log("completed citations", response.citations[0]);
                //         final_response += item.contentBlockDelta.delta?.text;
                // console.log("requested message: ", req_data.message.message, "\nresponse: ", final_response);
                return final_response;
            } catch (err) {
                console.error("Error invoking bedrock:", err);
            }
        } catch (err) {
            // console.log("err captured during streaming the message:", err)
            console.log("error code ", err.code)
            // console.log("error message: ", err.message)
        }
    }

    async *sendRequestRAGStreaming(req_data) {
        // console.log("chat request by user :", req_data)
        try {
            let final_response = ``;
            // Define model ID and conversation
            // const modelId = "anthropic.claude-3-sonnet-20240229-v1:0";
            const modelId = "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0";
            let kb_id = "ZTNXRBLX1J"
            // Send the command and handle streaming response
            try {
                let rag_config = {
                    input: { text: req_data.message.message },
                    retrieveAndGenerateConfiguration: {
                        type: "KNOWLEDGE_BASE",
                        knowledgeBaseConfiguration: {
                            knowledgeBaseId: kb_id,
                            modelArn: modelId,
                        }
                    }
                }

                if(req_data.message.unique_id){
                    // console.log("session id is present in the request data", req_data.message.unique_id)
                    rag_config.sessionId = req_data.message.unique_id
                }

                const command = new RetrieveAndGenerateStreamCommand(rag_config);
                const response = await client_rag_stream.send(command);
                final_response = response
                // console.log("Response of the client_rag_stream to the model", response);
                // final_response = response.stream.output.text;
                for await (const item of response.stream) {
                    // console.log("item", item);
                    yield { resp: item, session_id: response.sessionId };
                    // if(item.output?.text){
                    //     yield item.output.text;
                    // }
                    // TODO: create a condition to check if the item is a citation and push it to the final response
                    // if (item.contentBlockDelta) {
                    //     console.log("single response:::::", item.contentBlockDelta.delta?.text);
                    //     // process.stdout.write(item.contentBlockDelta.delta?.text);
                    //     final_response += item.contentBlockDelta.delta?.text;
                    //     yield item.contentBlockDelta.delta?.text;
                    // }
                }
                // console.log("requested message: ", req_data.message.message, "\nresponse: ", final_response);
                // return final_response;
            } catch (err) {
                console.error("Error invoking bedrock:", err);
            }
        } catch (err) {
            // console.log("err captured during streaming the message:", err)
            console.log("error code ", err.code)
            // console.log("error message: ", err.message)
        }
    }

    async executeListSessionsCommand (){
        try{
            const input = { // ListSessionsRequest
                maxResults: 10
                // nextToken: "STRING_VALUE",
              };
              const command = new ListSessionsCommand(input);
              const response = await client.send(command);
            }catch (err) {
                console.error("Error invoking bedrock:", err);
            }

    }
}

module.exports = BedrockChatUtils;
