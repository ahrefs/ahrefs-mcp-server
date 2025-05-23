import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { OpenApiMcpServer } from './server.js';
import * as console from 'console';

console.error("Starting STDIO transport");
const serverInstance = new OpenApiMcpServer();
const stdioTransport = new StdioServerTransport();

// Connect the server instance to the transport
serverInstance.server.connect(stdioTransport)
    .then(() => {
        console.error("MCP server connected via STDIO and running.");
        console.error("MCP_SERVER_READY");
    })
    .catch(error => {
        console.error("Failed to connect MCP server via STDIO:", error);
        process.exit(1);
    });