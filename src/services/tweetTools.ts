import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { 
    TwitterApi,
    SendTweetV2Params,
    TweetV2PostTweetResult,
    TweetV2BookmarkResult
  } from 'twitter-api-v2';

export class TweetToolsCreationService{
    private _server: McpServer;
    private _rwClient: TwitterApi;

    constructor(server: McpServer,rwClient: TwitterApi){
        this._server = server;
        this._rwClient = rwClient;
    }

    public addTools(){
        this._server.tool(
            "post-tweet",
            "Post a tweet with the specified content",
            {
              content: z.string()
            },
            async ({ content }) => {
              try {
                const tweet = await this._rwClient.v2.tweet(content);
                return {
                  content: [
                    {
                      type: "text",
                      text: `Tweet posted successfully! Tweet ID: ${tweet.data.id}`
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error posting tweet: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "like-tweet",
            "Like a specific tweet",
            {
              tweetId: z.string().describe("The ID of the tweet to like"),
              userId: z.string().describe("The ID of the X user who will like the tweet.")
            },
            async ({ userId, tweetId }) => {
              try {
                // Like the tweet
                const result = await this._rwClient.v2.like(userId, tweetId);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: result.data.liked 
                        ? `Successfully liked tweet ${tweetId}` 
                        : `Failed to like tweet ${tweetId}`
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error liking tweet: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "unlike-tweet",
            "Unlike a specific tweet",
            {
              tweetId: z.string().describe("The ID of the tweet to unlike"),
              userId: z.string().describe("The ID of the X user who will unlike the tweet.")
            },
            async ({ userId, tweetId }) => {
              try {
                // Unlike the tweet
                const result = await this._rwClient.v2.unlike(userId, tweetId);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: result.data.liked === false
                        ? `Successfully unliked tweet ${tweetId}` 
                        : `Failed to unlike tweet ${tweetId}`
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error unliking tweet: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "retweet",
            "Retweet a specific tweet",
            {
              tweetId: z.string().describe("The ID of the tweet to retweet"),
              userId: z.string().describe("The ID of the X user who will retweet the tweet.")
            },
            async ({ userId, tweetId }) => {
              try {
                // Retweet the tweet
                const result = await this._rwClient.v2.retweet(userId, tweetId);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: result.data.retweeted
                        ? `Successfully retweeted tweet ${tweetId}` 
                        : `Failed to retweet tweet ${tweetId}`
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error retweeting tweet: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "unretweet",
            "Remove a retweet from a specific tweet",
            {
              tweetId: z.string().describe("The ID of the tweet to unretweet"),
              userId: z.string().describe("The ID of the X user who will unretweet the tweet.")
            },
            async ({ userId, tweetId }) => {
              try {
                // Unretweet the tweet
                const result = await this._rwClient.v2.unretweet(userId, tweetId);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: result.data.retweeted === false
                        ? `Successfully unretweeted tweet ${tweetId}` 
                        : `Failed to unretweet tweet ${tweetId}`
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error unretweeting tweet: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "advanced-tweet",
            "Post a tweet with advanced options like reply to a tweet, quote a specific tweet, or create a poll for the tweet,",
            {
              text: z.string().describe("The text content of the tweet"),
              reply_to: z.string().optional().describe("Tweet ID to reply to"),
              quote: z.string().optional().describe("Tweet ID to quote"),
              poll: z.object({
                options: z.array(z.string()).min(2).max(4).describe("Poll options (2-4 choices)"),
                duration_minutes: z.number().optional().describe("Poll duration in minutes")
              }).optional().describe("Add a poll to the tweet")
            },
            async ({ text, reply_to, quote, poll }) => {
              try {
                // Build the tweet parameters
                const tweetParams: SendTweetV2Params = { text };
                
                // Add reply settings if specified
                if (reply_to) {
                  tweetParams.reply = { in_reply_to_tweet_id: reply_to };
                }
                
                // Add quote tweet if specified
                if (quote) {
                  tweetParams.quote_tweet_id = quote;
                }
                
                // Add poll if specified
                if (poll) {
                  tweetParams.poll = {
                    options: poll.options,
                    duration_minutes: poll.duration_minutes || 1440 // Default to 24 hours
                  };
                }
                
                // Post the tweet
                const result = await this._rwClient.v2.tweet(tweetParams);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: `Tweet posted successfully! Tweet ID: ${result.data.id}`
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error posting tweet: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          
          this._server.tool(
            "quote-a-tweet",
            "Quote a specific tweet",
            {
              text: z.string().describe("The text content of the reply"),
              tweetId: z.string().describe("The ID of the tweet to reply to")
            },
            async ({ text, tweetId }) => {
              try {
                // Use the tweet method with reply parameter
                const result = await this._rwClient.v2.tweet({
                  text: text,
                  reply: {
                    in_reply_to_tweet_id: tweetId
                  }
                });
                
                return {
                  content: [
                    {
                      type: "text",
                      text: `Reply posted successfully! Reply ID: ${result.data.id}`
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error posting reply: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "tweet-thread",
            "Post a thread of tweets",
            {
              tweets: z.array(z.union([z.string(), z.object({})])).describe("An array of tweets to post as a thread")
            },
            async ({ tweets }) => {
              const queryParamsArray: SendTweetV2Params[] = tweets.map(tweet => 
                typeof tweet === 'string' ? { text: tweet } : tweet
              );
          
              try {
                const postedTweets: TweetV2PostTweetResult[] = await this._rwClient.v2.tweetThread(queryParamsArray);
                
                return {
                  content: [
                    {
                      type: "text",
                      text: `Thread posted successfully! Tweet IDs: ${postedTweets.map(tweet => tweet.data.id).join(', ')}`
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error posting thread: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "add-delete-bookmark",
            "Add or delete a bookmark for a specific tweet",
            {
              tweetId: z.string().describe("The ID of the tweet to bookmark or delete the bookmark for"),
              isAddBookmark: z.boolean().describe("True to bookmark the tweet, false to delete the bookmark")
            },
            async ({ tweetId, isAddBookmark }) => {
              try {
                const result: TweetV2BookmarkResult = isAddBookmark 
                  ? await this._rwClient.v2.bookmark(tweetId) 
                  : await this._rwClient.v2.deleteBookmark(tweetId);
          
                return {
                  content: [
                    {
                      type: "text",
                      text: isAddBookmark 
                        ? `Tweet ${tweetId} bookmarked successfully!` 
                        : `Bookmark for tweet ${tweetId} deleted successfully!`
                    }
                  ]
                };
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error toggling bookmark: ${error}`
                    }
                  ]
                };
              }
            }
          );
          
          this._server.tool(
            "get-tweets",
            "Get one or more tweets by their IDs",
            {
              tweetIds: z.union([
                z.string().describe("A single tweet ID"),
                z.array(z.string()).describe("An array of tweet IDs")
              ])
            },
            async ({ tweetIds }) => {
              try {
                if (typeof tweetIds === 'string') {
                  const tweet = await this._rwClient.v2.singleTweet(tweetIds, {
                    expansions: ['author_id', 'attachments.media_keys'],
                    'tweet.fields': ['created_at', 'public_metrics', 'text', 'entities'],
                    'user.fields': ['name', 'username', 'profile_image_url']
                  });
                  
                  return {
                    content: [
                      {
                        type: "text",
                        text: JSON.stringify(tweet.data, null, 2)
                      }
                    ]
                  };
                } else {
                  const tweets = await this._rwClient.v2.tweets(tweetIds, {
                    expansions: ['author_id', 'attachments.media_keys'],
                    'tweet.fields': ['created_at', 'public_metrics', 'text', 'entities'],
                    'user.fields': ['name', 'username', 'profile_image_url']
                  });
                  
                  return {
                    content: [
                      {
                        type: "text",
                        text: JSON.stringify(tweets, null, 2)
                      }
                    ]
                  };
                }
              } catch (error) {
                return {
                  content: [
                    {
                      type: "text",
                      text: `Error fetching tweets: ${error}`
                    }
                  ]
                };
              }
            }
          );
    }
}