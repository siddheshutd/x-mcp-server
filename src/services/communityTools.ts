import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { 
    TwitterApi,
    CommunitySearchV2Params
  } from 'twitter-api-v2';

export class CommunityToolsCreationService{
    private _server: McpServer;
    private _rwClient: TwitterApi;

    constructor(server: McpServer, rwClient: TwitterApi){
        this._server = server;
        this._rwClient = rwClient;
    }

    public addTools(){
        this._server.tool(
            "get-community",
            "Get details for a specific X community",
            {
              communityId: z.string().describe("The ID of the community to fetch details for")
            },
            async ({ communityId }) => {
              try {
                // The Twitter API v2 community endpoint doesn't support many fields yet
                const communityDetails = await this._rwClient.v2.community(communityId);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify(communityDetails.data, null, 2)
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error fetching community details: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "search-communities",
            "Search for X communities by keyword",
            {
              query: z.string().describe("The search query for finding communities"),
              maxResults: z.number().optional().describe("Maximum number of results to return")
            },
            async ({ query, maxResults = 10 }) => {
              try {
                // Create params object
                const params: Partial<CommunitySearchV2Params> = {
                  max_results: maxResults
                };
                
                const communities = await this._rwClient.v2.searchCommunities(query, params);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify(communities.data, null, 2)
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error searching communities: ${error}`
                    }
                  ]
                };
              }
            }
          );
    }
}