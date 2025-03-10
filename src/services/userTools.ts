import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { 
  TwitterApi, 
  UserV2Result,
  UsersV2Params,
  UserV2TimelineParams,
} from 'twitter-api-v2';

export class UserToolsCreationService{
    private _server: McpServer;
    private _rwClient: TwitterApi;

    constructor(server: McpServer, rwClient: TwitterApi){
        this._server = server;
        this._rwClient = rwClient;
    }

    public addTools(){
        this._server.tool(
            "get-my-details",
            "Get my X account details",
            {},
            async () => {
              try {
                const userDetails: UserV2Result = await this._rwClient.v2.me();
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify(userDetails.data), 
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error fetching X account details: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "get-user-details",
            "Get details for a specific X user by ID",
            {
              userId: z.string().describe("The X user ID to fetch details for")
            },
            async ({ userId }) => {
              try {
                const params: Partial<UsersV2Params> = {
                  'user.fields': [
                    'created_at',
                    'description',
                    'entities',
                    'location',
                    'name',
                    'profile_image_url',
                    'protected',
                    'public_metrics',
                    'url',
                    'username',
                    'verified',
                    'verified_type'
                  ]
                };
                
                const userDetails = await this._rwClient.v2.user(userId, params);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify(userDetails.data, null, 2)
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error fetching user details: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "get-user-by-username",
            "Get details for a specific X user by username",
            {
              username: z.string().describe("The X username (without @) to fetch details for")
            },
            async ({ username }) => {
              try {
                const params: Partial<UsersV2Params> = {
                  'user.fields': [
                    'created_at',
                    'description',
                    'entities',
                    'location',
                    'name',
                    'profile_image_url',
                    'protected',
                    'public_metrics',
                    'url',
                    'username',
                    'verified',
                    'verified_type'
                  ]
                };
                
                const userDetails = await this._rwClient.v2.userByUsername(username, params);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify(userDetails.data, null, 2)
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error fetching user by username: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "get-user-followers",
            "Get followers of a specific X user",
            {
              userId: z.string().describe("The X user ID to fetch followers for"),
              maxResults: z.number().optional().describe("Maximum number of results to return")
            },
            async ({ userId, maxResults = 10 }) => {
              try {
                const params: Partial<UserV2TimelineParams> = {
                  max_results: maxResults,
                  'user.fields': [
                    'created_at',
                    'description',
                    'location',
                    'name',
                    'profile_image_url',
                    'protected',
                    'public_metrics',
                    'url',
                    'username',
                    'verified',
                    'verified_type'
                  ]
                };
                
                // Get followers with pagination
                const followers = await this._rwClient.v2.followers(userId, { 
                  asPaginator: true,
                  ...params
                });
                
                // Fetch the specified number of results
                const followersList = await followers.fetchLast(maxResults);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify({
                        meta: followersList.meta,
                        data: followersList.data,
                        includes: followersList.includes
                      }, null, 2)
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error fetching user followers: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "get-user-following",
            "Get accounts that a specific X user is following",
            {
              userId: z.string().describe("The X user ID to fetch following accounts for"),
              maxResults: z.number().optional().describe("Maximum number of results to return")
            },
            async ({ userId, maxResults = 10 }) => {
              try {
                const params: Partial<UserV2TimelineParams> = {
                  max_results: maxResults,
                  'user.fields': [
                    'created_at',
                    'description',
                    'location',
                    'name',
                    'profile_image_url',
                    'protected',
                    'public_metrics',
                    'url',
                    'username',
                    'verified',
                    'verified_type'
                  ]
                };
                
                // Get following accounts with pagination
                const following = await this._rwClient.v2.following(userId, { 
                  asPaginator: true,
                  ...params
                });
                
                // Fetch the specified number of results
                const followingList = await following.fetchLast(maxResults);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify({
                        meta: followingList.meta,
                        data: followingList.data,
                        includes: followingList.includes
                      }, null, 2)
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error fetching accounts user is following: ${error}`
                    }
                  ]
                };
              }
            }
          );
    }
}