/**
 * Binds services to the container
 */
import 'reflect-metadata';
import { Container } from 'inversify';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TwitterApi } from 'twitter-api-v2';

const container = new Container();

container.bind<McpServer>('McpServer').toConstantValue(new McpServer({
    name: "x-mcp-server",
    version: "1.0.0",
}));

container.bind<TwitterApi>('TwitterApi').toConstantValue(new TwitterApi({
    appKey: process.env.X_API_KEY ?? '',
    appSecret: process.env.X_API_KEY_SECRET ?? '',
    accessToken: process.env.X_ACCESS_TOKEN ?? '',
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET ?? '',
}));

/**
 * The below injection didn't work and was erroring out. RCA to be found and worked upon.
 */

// container.bind<UserToolsCreationService>('UserToolsCreationService').to(UserToolsCreationService);
// container.bind<TweetToolsCreationService>('TweetsToolsCreationService').to(TweetToolsCreationService);
// container.bind<TimelineToolsCreationService>('TimelineToolsCreationService').to(TimelineToolsCreationService);
// container.bind<CommunityToolsCreationService>('CommunityToolsCreationService').to(CommunityToolsCreationService);

export { container };