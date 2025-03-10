import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { 
    TwitterApi, 
    TweetV2HomeTimelineParams, 
    TweetV2UserTimelineParams,
    TweetV2PaginableTimelineParams,
  } from 'twitter-api-v2';

export class TimelineToolsCreationService{
    private _server: McpServer;
    private _rwClient: TwitterApi;

    constructor(server: McpServer, rwClient: TwitterApi){
        this._server = server;
        this._rwClient = rwClient;
    }

    public addTools(){
        this._server.tool(
            "get-home-timeline",
            "Get tweets from your home timeline",
            {
              maxResults: z.number().optional().describe("Maximum number of results to return"),
              excludeReplies: z.boolean().optional().describe("Whether to exclude replies"),
              excludeRetweets: z.boolean().optional().describe("Whether to exclude retweets")
            },
            async ({ maxResults = 10, excludeReplies = false, excludeRetweets = false }) => {
              try {
                const timelineParams: Partial<TweetV2HomeTimelineParams> = {
                  max_results: maxResults,
                  exclude: [],
                  expansions: ['author_id', 'attachments.media_keys', 'referenced_tweets.id'],
                  'tweet.fields': ['created_at', 'public_metrics', 'text', 'entities'],
                  'user.fields': ['name', 'username', 'profile_image_url']
                };
          
                const excludeArray: ("replies" | "retweets")[] = [];
                if (excludeReplies) excludeArray.push('replies');
                if (excludeRetweets) excludeArray.push('retweets');
                
                // Only set exclude if we have items to exclude
                if (excludeArray.length > 0) {
                  timelineParams.exclude = excludeArray;
                }
          
                const timeline = await this._rwClient.v2.homeTimeline(timelineParams);
                
                // Get the first page of results
                const tweets = await timeline.fetchLast(maxResults);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify({
                        meta: tweets.meta,
                        data: tweets.data,
                        includes: tweets.includes
                      }, null, 2)
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error fetching home timeline: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          //User Timeline
          this._server.tool(
            "get-user-timeline",
            "Get tweets from a specific user's timeline",
            {
              userId: z.string().describe("The X user ID to fetch tweets from"),
              maxResults: z.number().max(3200).optional().describe("Maximum number of results to return"),
              excludeReplies: z.boolean().optional().describe("Whether to exclude replies"),
              excludeRetweets: z.boolean().optional().describe("Whether to exclude retweets")
            },
            async ({ userId, maxResults = 10, excludeReplies = false, excludeRetweets = false }) => {
              try {
                const timelineParams: Partial<TweetV2UserTimelineParams> = {
                  max_results: maxResults,
                  expansions: ['author_id', 'attachments.media_keys', 'referenced_tweets.id'],
                  'tweet.fields': ['created_at', 'public_metrics', 'text', 'entities'],
                  'user.fields': ['name', 'username', 'profile_image_url']
                };
          
                const excludeArray: ("replies" | "retweets")[] = [];
                if (excludeReplies) excludeArray.push('replies');
                if (excludeRetweets) excludeArray.push('retweets');
                
                // Only set exclude if we have items to exclude
                if (excludeArray.length > 0) {
                  timelineParams.exclude = excludeArray;
                }
          
                const timeline = await this._rwClient.v2.userTimeline(userId, timelineParams);
                
                // Get the first page of results
                const tweets = await timeline.fetchLast(maxResults);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify({
                        meta: tweets.meta,
                        data: tweets.data,
                        includes: tweets.includes
                      }, null, 2)
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error fetching user timeline: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          // Quoted Tweets
          this._server.tool(
            "get-quoted-tweets",
            "Get tweets that quote a specific tweet",
            {
              tweetId: z.string().describe("The ID of the tweet to get quotes for"),
              maxResults: z.number().optional().describe("Maximum number of results to return")
            },
            async ({ tweetId, maxResults = 10 }) => {
              try {
                const params: Partial<TweetV2PaginableTimelineParams> = {
                  max_results: maxResults,
                  expansions: ['author_id', 'attachments.media_keys', 'referenced_tweets.id'],
                  'tweet.fields': ['created_at', 'public_metrics', 'text', 'entities'],
                  'user.fields': ['name', 'username', 'profile_image_url']
                };
          
                const quoteTweets = await this._rwClient.v2.quotes(tweetId, params);
                
                const tweets = await quoteTweets.fetchLast(maxResults);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: JSON.stringify({
                        meta: tweets.meta,
                        data: tweets.data,
                        includes: tweets.includes
                      }, null, 2)
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error fetching quote tweets: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
    }
}