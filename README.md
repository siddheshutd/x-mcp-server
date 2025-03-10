# X MCP Server

This tool is an MCP server for interacting with the X platform via an MCP client such as Claude, Cursor AI, Windsurf AI, etc.

## Prerequisites

1. Node.js (>=18.0.0)
2. npm (>=8.0.0)
3. X Developer API keys

## Important Notes regarding to the rate limits of the X APIs
- There is a rate limit on the number of requests per minute for the X APIs, which is set by the X platform.
- You can refer to this page for knowing the limits: https://developer.x.com/en/portal/products

## Getting Started

1. Clone this repository:
   ```bash
   git clone <repository-url>
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```
   This will compile the `index.ts` file in the `src` folder and create the `build` directory.

## Configuration

1. You will need your X Developer API keys to use this tool. You will need these 4 keys/tokens:
   - X API Key
   - X API Key Secret
   - X Access Token
   - X Access Token Secret

   In case you are not aware of how to get these keys/tokens, you can follow the instructions on the X Developer website: https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api

2. Set the environment variables:
   You will have to setup the MCP server for your client.

   1. For Claude:
      - Open Claude Desktop
      - Go to Settings -> Developer
      - Here you will see an option to configure MCP servers by clicking on it (Edit Config)
      - Claude will open the folder containing the config file. Open the config file which is named `claude_desktop_config.json`.
      - Add the following configuration:
        ```json
        {
            "x-mcp-server": {
                "command": "node",
                "args": [
                    "/ABSOLUTE/PATH/TO/PARENT/FOLDER/x-mcp-server/build/index.js"
                ],
                "env": {
                    "X_API_KEY": "your-x-api-key",
                    "X_API_KEY_SECRET": "your-x-api-key-secret",
                    "X_ACCESS_TOKEN": "your-x-access-token",
                    "X_ACCESS_TOKEN_SECRET": "your-x-access-token-secret"
                }
            }
        }
        ```
      - Save the config file.
      - Restart Claude Desktop.
      - You can refer the official Anthropic documentation for setting up an MCP server https://modelcontextprotocol.io/quickstart/server

   2. For Cursor AI:
      - You can follow the instructions in the Cursor documentation: https://docs.cursor.com/context/model-context-protocol

   3. For Windsurf AI:
      - Open a new chat in Cascade.
      - You should see a Configure MCP button below the Cascade's prompt input. Click on it.
      - It will open the config file in the editor and you can add the following configuration:
        ```json
        {
            "mcpServers": {
                "x-mcp-server": {
                    "command": "node",
                    "args": [
                        "/ABSOLUTE/PATH/TO/PARENT/FOLDER/x-mcp-server/build/index.js"
                    ],
                    "env": {
                        "X_API_KEY": "your-x-api-key",
                        "X_API_KEY_SECRET": "your-x-api-key-secret",
                        "X_ACCESS_TOKEN": "your-x-access-token",
                        "X_ACCESS_TOKEN_SECRET": "your-x-access-token-secret"
                    }
                }
            }
        }
        ```
      - Save file and click on the Refresh servers button below the Cascade's prompt input.

   4. For other MCP clients:
      - You can refer to the official MCP documentation: https://modelcontextprotocol.io/introduction

Now you can connect to this MCP server locally using your preferred MCP client and interact with the X platform.