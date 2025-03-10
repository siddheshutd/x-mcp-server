import { container } from "./DI/container.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TwitterApi } from 'twitter-api-v2';
import { UserToolsCreationService } from "./services/userTools.js";
import { TweetToolsCreationService } from "./services/tweetTools.js";
import { TimelineToolsCreationService } from "./services/timelineTools.js";
import { CommunityToolsCreationService } from "./services/communityTools.js";

const server: McpServer = container.get('McpServer');
const rwClient: TwitterApi = container.get('TwitterApi');

const userService = new UserToolsCreationService(server, rwClient);
userService.addTools();

const tweetService = new TweetToolsCreationService(server, rwClient);
tweetService.addTools();

const timelineService = new TimelineToolsCreationService(server, rwClient);
timelineService.addTools();

const communityService = new CommunityToolsCreationService(server, rwClient);
communityService.addTools();

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("X MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});