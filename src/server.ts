import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    CallToolResult,
    McpError,
    ErrorCode,
    Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosError, Method } from 'axios';
import * as console from 'console';

// Environment variables are loaded by the main index.ts
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.ahrefs.com/v3';
const API_KEY = process.env.API_KEY;

const tools: Tool[] = [
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "date_compared",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "device",
                "required": true
            },
            {
                "in": "query",
                "name": "project_id",
                "required": true
            },
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "rank-tracker/overview",
        "_original_request_body": null,
        "description": "Provides an overview of tracked keyword rankings and related search metrics for a specified project and date, with support for historical comparison, filtering, column selection, and device type. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "date_compared": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                },
                "device": {
                    "type": "string"
                },
                "project_id": {
                    "type": "integer"
                },
                "volume_mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "date",
                "device",
                "project_id"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**best_position_has_thumbnail**: The top position has a thumbnail.  \ntype: boolean nullable  \n\n**best_position_has_thumbnail_previous**: The top position has a thumbnail on the comparison date.  \ntype: boolean nullable  \n\n**best_position_has_video_preview**: The top position has a video preview.  \ntype: boolean nullable  \n\n**best_position_has_video_preview_previous**: The top position has a video preview on the comparison date.  \ntype: boolean nullable  \n\n**best_position_kind**: The kind of the top position: organic, paid, or a SERP feature.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`  \n\n**best_position_kind_previous**: The kind of the top position on the comparison date.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`  \n\n**clicks**: Clicks metric refers to the average monthly number of clicks on the search results that people make while searching for the target keyword. Some searches generate clicks on multiple results, while others might not end in any clicks at all.  \ntype: integer nullable  \n\n**clicks_per_search**: Clicks Per Search is the ratio of Clicks to Keyword Search volume. It shows how many different search results get clicked, on average, when people search for the target keyword in a given country.  \ntype: number<float> nullable  \n\n**cost_per_click**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword.  \ntype: integer nullable  \n\n**country**: The country that a given keyword is being tracked in. A two-letter country code (ISO 3166-1 alpha-2).  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`  \n\n**country_prev**: The country that a given keyword is being tracked in on the comparison date. A two-letter country code (ISO 3166-1 alpha-2).  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`  \n\n**keyword**: The keyword your target ranks for.  \ntype: string  \n\n**keyword_difficulty**: An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable  \n\n**keyword_has_data**: Will return `false` if the keyword is still processing and no SERP has been fetched yet.  \ntype: boolean  \n\n**keyword_is_frozen**: Indicates whether a keyword has exceeded the tracked keywords limit on your plan. Such keywords are \"frozen\", meaning they do not have their rankings updated.  \ntype: boolean  \n\n**keyword_prev**: The keyword your target ranks for on the comparison date.  \ntype: string  \n\n**language**: The SERP language that a given keyword is being tracked for.  \ntype: string  \n\n**language_prev**: The SERP language on the comparison date.  \ntype: string  \n\n**location**: The location (country, state/province, or city) that a given keyword is being tracked in.  \ntype: string  \n\n**location_prev**: The location (country, state/province, or city) that a given keyword is being tracked in on the comparison date.  \ntype: string  \n\n**parent_topic**: Parent Topic determines if you can rank for your target keyword while targeting a more general topic on your page instead.  To identify the Parent Topic, we take the #1 ranking page for your keyword and find the keyword responsible for sending the most traffic to that page.  \ntype: string nullable  \n\n**position**: The top position your target ranks for in the organic search results for a keyword.  \ntype: integer nullable  \n\n**position_diff**: The change in position between your selected dates.  \ntype: integer nullable  \n\n**position_prev**: The top position on the comparison date.  \ntype: integer nullable  \n\n**search_type_image**: Search type Image shows the percentage of searches for a keyword made for images, highlighting interest in visual content.  \ntype: number<float> nullable  \n\n**search_type_news**: Search type News shows the percentage of searches for a keyword made for news articles.  \ntype: number<float> nullable  \n\n**search_type_video**: Search type Video shows the percentage of searches for a keyword made for video, reflecting interest in video content.  \ntype: number<float> nullable  \n\n**search_type_web**: Search type Web shows the percentage of searches for a keyword made for general web content, indicating interest in a wide range of information.  \ntype: number<float> nullable  \n\n**serp_features**: The SERP features that appear in search results for a keyword.  \ntype: array[string]  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`  \n\n**serp_updated**: The date when we last checked search engine results for a keyword.  \ntype: string<date-time> nullable  \n\n**serp_updated_prev**: The date when we checked search engine results up to the comparison date.  \ntype: string<date-time> nullable  \n\n**tags**: A list of tags assigned to a given keyword.  \ntype: array[string]  \n\n**tags_prev**: A list of tags assigned to a given keyword on the comparison date.  \ntype: array[string]  \n\n**target_positions_count**: The number of target URLs ranking for a keyword.  \ntype: integer  \n\n**traffic**: An estimation of the number of monthly visits that a page gets from organic search over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable  \n\n**traffic_diff**: The change in traffic between your selected dates.  \ntype: integer nullable  \n\n**traffic_prev**: An estimation of the number of monthly visits that a page gets from organic search over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable  \n\n**url**: The top ranking URL in organic search results for a given keyword.  \ntype: string<url> nullable  \n\n**url_prev**: The top ranking URL in organic search results for a given keyword on the comparison date.  \ntype: string<url> nullable  \n\n**volume**: An estimation of the average monthly number of searches for a keyword over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**best_position_has_thumbnail**: The top position has a thumbnail.  \ntype: boolean nullable\n\n**best_position_has_thumbnail_previous**: The top position has a thumbnail on the comparison date.  \ntype: boolean nullable\n\n**best_position_has_video_preview**: The top position has a video preview.  \ntype: boolean nullable\n\n**best_position_has_video_preview_previous**: The top position has a video preview on the comparison date.  \ntype: boolean nullable\n\n**best_position_kind**: The kind of the top position: organic, paid, or a SERP feature.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**best_position_kind_previous**: The kind of the top position on the comparison date.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**clicks**: Clicks metric refers to the average monthly number of clicks on the search results that people make while searching for the target keyword. Some searches generate clicks on multiple results, while others might not end in any clicks at all.  \ntype: integer nullable\n\n**clicks_per_search**: Clicks Per Search is the ratio of Clicks to Keyword Search volume. It shows how many different search results get clicked, on average, when people search for the target keyword in a given country.  \ntype: float nullable\n\n**cost_per_click**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword.  \ntype: integer nullable\n\n**country**: The country that a given keyword is being tracked in. A two-letter country code (ISO 3166-1 alpha-2).  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`\n\n**country_prev**: The country that a given keyword is being tracked in on the comparison date. A two-letter country code (ISO 3166-1 alpha-2).  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`\n\n**is_main_position**: Excludes positions in Sitelinks, Top stories, Image packs, and posts on X (Twitter).  \ntype: boolean\n\n**is_main_position_prev**: Excludes positions in Sitelinks, Top stories, Image packs, and posts on X (Twitter) on the comparison date.  \ntype: boolean\n\n**keyword**: The keyword your target ranks for.  \ntype: string\n\n**keyword_difficulty**: An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable\n\n**keyword_has_data**: Will return `false` if the keyword is still processing and no SERP has been fetched yet.  \ntype: boolean\n\n**keyword_is_frozen**: Indicates whether a keyword has exceeded the tracked keywords limit on your plan. Such keywords are \"frozen\", meaning they do not have their rankings updated.  \ntype: boolean\n\n**keyword_prev**: The keyword your target ranks for on the comparison date.  \ntype: string\n\n**keyword_words**: The number of words in a keyword.  \ntype: integer\n\n**keyword_words_prev**: The number of words in a keyword on the comparison date.  \ntype: integer\n\n**language**: The SERP language that a given keyword is being tracked for.  \ntype: string\n\n**language_prev**: The SERP language on the comparison date.  \ntype: string\n\n**location**: The location (country, state/province, or city) that a given keyword is being tracked in.  \ntype: string\n\n**location_prev**: The location (country, state/province, or city) that a given keyword is being tracked in on the comparison date.  \ntype: string\n\n**parent_topic**: Parent Topic determines if you can rank for your target keyword while targeting a more general topic on your page instead.  To identify the Parent Topic, we take the #1 ranking page for your keyword and find the keyword responsible for sending the most traffic to that page.  \ntype: string nullable\n\n**position**: The top position your target ranks for in the organic search results for a keyword.  \ntype: integer nullable\n\n**position_diff**: The change in position between your selected dates.  \ntype: integer nullable\n\n**position_prev**: The top position on the comparison date.  \ntype: integer nullable\n\n**search_type_image**: Search type Image shows the percentage of searches for a keyword made for images, highlighting interest in visual content.  \ntype: float nullable\n\n**search_type_news**: Search type News shows the percentage of searches for a keyword made for news articles.  \ntype: float nullable\n\n**search_type_video**: Search type Video shows the percentage of searches for a keyword made for video, reflecting interest in video content.  \ntype: float nullable\n\n**search_type_web**: Search type Web shows the percentage of searches for a keyword made for general web content, indicating interest in a wide range of information.  \ntype: float nullable\n\n**serp_features**: The SERP features that appear in search results for a keyword.  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**serp_updated**: The date when we last checked search engine results for a keyword.  \ntype: datetime nullable\n\n**serp_updated_prev**: The date when we checked search engine results up to the comparison date.  \ntype: datetime nullable\n\n**tags**: A list of tags assigned to a given keyword.  \ntype: array(string)\n\n**tags_prev**: A list of tags assigned to a given keyword on the comparison date.  \ntype: array(string)\n\n**target_positions_count**: The number of target URLs ranking for a keyword.  \ntype: integer\n\n**traffic**: An estimation of the number of monthly visits that a page gets from organic search over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable\n\n**traffic_diff**: The change in traffic between your selected dates.  \ntype: integer nullable\n\n**traffic_prev**: An estimation of the number of monthly visits that a page gets from organic search over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable\n\n**url**: The top ranking URL in organic search results for a given keyword.  \ntype: string nullable\n\n**url_prev**: The top ranking URL in organic search results for a given keyword on the comparison date.  \ntype: string nullable\n\n**volume**: An estimation of the average monthly number of searches for a keyword over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "date_compared": {
                    "description": "A date to compare metrics with in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "device": {
                    "description": "Choose between mobile and desktop rankings.",
                    "type": "string",
                    "enum": [
                        "desktop",
                        "mobile"
                    ]
                },
                "project_id": {
                    "description": "The unique identifier of the project. You can find it in the URL of your Rank Tracker project in Ahrefs: `https://app.ahrefs.com/rank-tracker/overview/#project_id#`",
                    "type": "integer"
                },
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                }
            },
            "required": [
                "select",
                "date",
                "device",
                "project_id"
            ],
            "type": "object"
        },
        "name": "rank-tracker-overview"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "date_compared",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "device",
                "required": true
            },
            {
                "in": "query",
                "name": "project_id",
                "required": true
            },
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "rank-tracker/competitors-overview",
        "_original_request_body": null,
        "description": "Provides an overview of competitor rankings and keyword metrics for a specified project and date in Ahrefs Rank Tracker, allowing comparison between current and previous data. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "date_compared": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                },
                "device": {
                    "type": "string"
                },
                "project_id": {
                    "type": "integer"
                },
                "volume_mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "date",
                "device",
                "project_id"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**competitors_list**: Competitors information for a given keyword. The following fields are included: `url`, `url_prev`, `position`, `position_prev`, `best_position_kind`, `best_position_kind`, `traffic`, `traffic_prev`, `value`, `value_prev`. Fields ending in `prev` are included only in the compared view.  \ntype: array[object]  \n\n**country**: The country that a given keyword is being tracked in. A two-letter country code (ISO 3166-1 alpha-2).  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`  \n\n**keyword**: The keyword your target ranks for.  \ntype: string  \n\n**keyword_difficulty**: An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable  \n\n**keyword_has_data**: Will return `false` if the keyword is still processing and no SERP has been fetched yet.  \ntype: boolean  \n\n**keyword_is_frozen**: Indicates whether a keyword has exceeded the tracked keywords limit on your plan. Such keywords are \"frozen\", meaning they do not have their rankings updated.  \ntype: boolean  \n\n**language**: The SERP language that a given keyword is being tracked for.  \ntype: string  \n\n**location**: The location (country, state/province, or city) that a given keyword is being tracked in.  \ntype: string  \n\n**serp_features**: The SERP features that appear in search results for a keyword.  \ntype: array[string]  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`  \n\n**serp_updated**: The date when we last checked search engine results for a keyword.  \ntype: string<date-time> nullable  \n\n**serp_updated_prev**: The date when we checked search engine results up to the comparison date.  \ntype: string<date-time> nullable  \n\n**tags**: A list of tags assigned to a given keyword.  \ntype: array[string]  \n\n**volume**: An estimation of the average monthly number of searches for a keyword over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**country**: The country that a given keyword is being tracked in. A two-letter country code (ISO 3166-1 alpha-2).  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`\n\n**is_main_position**: Excludes positions in Sitelinks, Top stories, Image packs, and posts on X (Twitter).  \ntype: boolean\n\n**is_main_position_prev**: Excludes positions in Sitelinks, Top stories, Image packs, and posts on X (Twitter) on the comparison date.  \ntype: boolean\n\n**keyword**: The keyword your target ranks for.  \ntype: string\n\n**keyword_difficulty**: An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable\n\n**keyword_has_data**: Will return `false` if the keyword is still processing and no SERP has been fetched yet.  \ntype: boolean\n\n**keyword_is_frozen**: Indicates whether a keyword has exceeded the tracked keywords limit on your plan. Such keywords are \"frozen\", meaning they do not have their rankings updated.  \ntype: boolean\n\n**language**: The SERP language that a given keyword is being tracked for.  \ntype: string\n\n**location**: The location (country, state/province, or city) that a given keyword is being tracked in.  \ntype: string\n\n**serp_features**: The SERP features that appear in search results for a keyword.  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**serp_updated**: The date when we last checked search engine results for a keyword.  \ntype: datetime nullable\n\n**serp_updated_prev**: The date when we checked search engine results up to the comparison date.  \ntype: datetime nullable\n\n**tags**: A list of tags assigned to a given keyword.  \ntype: array(string)\n\n**volume**: An estimation of the average monthly number of searches for a keyword over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "date_compared": {
                    "description": "A date to compare metrics with in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "device": {
                    "description": "Choose between mobile and desktop rankings.",
                    "type": "string",
                    "enum": [
                        "desktop",
                        "mobile"
                    ]
                },
                "project_id": {
                    "description": "The unique identifier of the project. You can find it in the URL of your Rank Tracker project in Ahrefs: `https://app.ahrefs.com/rank-tracker/overview/#project_id#`",
                    "type": "integer"
                },
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                }
            },
            "required": [
                "select",
                "date",
                "device",
                "project_id"
            ],
            "type": "object"
        },
        "name": "rank-tracker-competitors-overview"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "date_compared",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "device",
                "required": true
            },
            {
                "in": "query",
                "name": "project_id",
                "required": true
            },
            {
                "in": "query",
                "name": "target_and_tracked_competitors_only",
                "required": false
            },
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "rank-tracker/competitors-pages",
        "_original_request_body": null,
        "description": "Provides an overview of competitor pages and keyword metrics for a specified project and date in Ahrefs Rank Tracker, allowing comparison between current and previous data. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "date_compared": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                },
                "device": {
                    "type": "string"
                },
                "project_id": {
                    "type": "integer"
                },
                "target_and_tracked_competitors_only": {
                    "type": "boolean"
                },
                "volume_mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "date",
                "device",
                "project_id"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:\n\n**keywords**: The total number of keywords that your target ranks for in the top 100 organic search results.  \ntype: integer  \n\n**share_of_traffic_value**: The share of your target's organic search traffic value compared to the total organic search traffic value for all tracked keywords.  \ntype: float  \n\n**share_of_traffic_value_prev**: The share of traffic value on the comparison date.  \ntype: float  \n\n**share_of_voice**: The share of your target's organic search traffic compared to the total organic search traffic for all tracked keywords.  \ntype: float  \n\n**share_of_voice_prev**: The share of voice on the comparison date.  \ntype: float  \n\n**status**: The status of a page: the new page that just started to rank (\"left\"), the lost page that disappeared from search results (\"right\"), or no change (\"both\").  \ntype: string  \nenum: `\"left\"` `\"right\"` `\"both\"`  \n\n**title**: The title displayed for the page in its top keyword's SERP.  \ntype: string nullable  \n\n**title_prev**: The title on the comparison date.  \ntype: string nullable  \n\n**traffic**: An estimation of the number of monthly visits that a page gets from organic search.  \ntype: integer  \n\n**traffic_prev**: The traffic on the comparison date.  \ntype: integer  \n\n**traffic_value**: The estimated value of a page's monthly organic search traffic, in USD cents.  \ntype: integer nullable  \n\n**traffic_value_prev**: The traffic value on the comparison date.  \ntype: integer nullable  \n\n**url**: The page URL.  \ntype: string  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**country**: The country that a given keyword is being tracked in. A two-letter country code (ISO 3166-1 alpha-2).  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`\n\n**country_prev**: The country that a given keyword is being tracked in on the comparison date. A two-letter country code (ISO 3166-1 alpha-2).  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`\n\n**domain**: The page domain.  \ntype: string\n\n**language**: The SERP language that a given keyword is being tracked for.  \ntype: string\n\n**language_prev**: The SERP language on the comparison date.  \ntype: string\n\n**location**: The location (country, state/province, or city) that a given keyword is being tracked in.  \ntype: string\n\n**location_prev**: The location (country, state/province, or city) that a given keyword is being tracked in on the comparison date.  \ntype: string\n\n**tags**: A list of tags assigned to a given keyword.  \ntype: array(string)\n\n**tags_prev**: A list of tags assigned to a given keyword on the comparison date.  \ntype: array(string)\n\n**url**: The page URL.  \ntype: string",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "date_compared": {
                    "description": "A date to compare metrics with in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "device": {
                    "description": "Choose between mobile and desktop rankings.",
                    "type": "string",
                    "enum": [
                        "desktop",
                        "mobile"
                    ]
                },
                "project_id": {
                    "description": "The unique identifier of the project. You can find it in the URL of your Rank Tracker project in Ahrefs: `https://app.ahrefs.com/rank-tracker/overview/#project_id#`",
                    "type": "integer"
                },
                "target_and_tracked_competitors_only": {
                    "description": "If true, restrict pages to target and tracked competitors.",
                    "type": "boolean"
                },
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                }
            },
            "required": [
                "select",
                "date",
                "device",
                "project_id"
            ],
            "type": "object"
        },
        "name": "rank-tracker-competitors-pages"
    },
    {
        "_original_method": "POST",
        "_original_parameters": [
            {
                "in": "body",
                "name": "select",
                "required": true
            },
            {
                "in": "body",
                "name": "order_by",
                "required": false
            },
            {
                "in": "body",
                "name": "country",
                "required": false
            },
            {
                "in": "body",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "body",
                "name": "targets",
                "required": true
            },
            {
                "in": "body",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "batch-analysis/batch-analysis",
        "_original_request_body": {
            "required": true,
            "content_type": "application/json"
        },
        "description": "Performs a batch analysis of multiple URLs, domains, or subdomains to retrieve selected SEO, backlink, organic, and paid traffic metrics. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "select": {
                    "type": "array"
                },
                "order_by": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "volume_mode": {
                    "type": "string"
                },
                "targets": {
                    "type": "array"
                }
            },
            "required": [
                "select",
                "targets"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c\n\nResponse schema:**ahrefs_rank**: The strength of your target's backlink profile compared to the other websites in our database, with rank #1 being the strongest.  \ntype: integer nullable  \n\n**domain_rating**: The strength of your target's backlink profile compared to the other websites in our database on a 100-point logarithmic scale.  \ntype: number<float> nullable  \n\n**index**: Target index number.  \ntype: integer  \n\n**mode**: The target mode used for the analysis. Depending on the selected mode (Exact URL, Path, Domain, Subdomains), different parts of the website will be analyzed.  \ntype: string  \n\n**org_cost**: (10 units) The estimated value of your target’s monthly organic search traffic.  \ntype: integer nullable  \n\n**org_keywords**: The total number of keywords that your target ranks for in the top 100 organic search results. When ranking for the same keyword across different locations in “All locations” mode, it's still counted as one keyword.  \ntype: integer nullable  \n\n**org_keywords_11_20**: The total number of unique keywords for which your target's top organic ranking position is within the 11th to 20th results. When ranking for the same keyword across different locations in “All locations” mode, it's still counted as one keyword.  \ntype: integer nullable  \n\n**org_keywords_1_3**: The total number of unique keywords for which your target's top organic ranking position is within the top 3 results. When ranking for the same keyword across different locations in “All locations” mode, it's still counted as one keyword.  \ntype: integer nullable  \n\n**org_keywords_21_50**: The total number of unique keywords for which your target's top organic ranking position is within the 21st to 50th results. When ranking for the same keyword across different locations in “All locations” mode, it's still counted as one keyword.  \ntype: integer nullable  \n\n**org_keywords_4_10**: The total number of unique keywords for which your target's top organic ranking position is within the 4th to 10th results. When ranking for the same keyword across different locations in “All locations” mode, it's still counted as one keyword.  \ntype: integer nullable  \n\n**org_keywords_51_plus**: The total number of unique keywords for which your target's top organic ranking position is the 51st result or higher. When ranking for the same keyword across different locations in “All locations” mode, it's still counted as one keyword.  \ntype: integer nullable  \n\n**org_traffic**: (10 units) The estimated number of monthly visits that your target gets from organic search.  \ntype: integer nullable  \n\n**org_traffic_top_by_country**  \ntype: array[array]  \n\n**paid_ads**: The total number of unique ads of a target website or URL in paid search results.  \ntype: integer nullable  \n\n**paid_cost**: (10 units) The estimated cost of your target’s monthly paid search traffic.  \ntype: integer nullable  \n\n**paid_keywords**: The total number of keywords that your target ranks for in paid search results. When ranking for the same keyword across different locations in “All locations” mode, it's still counted as one keyword.  \ntype: integer nullable  \n\n**paid_traffic**: (10 units) The estimated number of monthly visits that your target gets from paid search.  \ntype: integer nullable  \n\n**protocol**: The protocol of the target. Possible values: `both`, `http`, `https`.  \ntype: string  \n\n**url**: The URL of the analyzed target.  \ntype: string<url>  \n\n**url_rating**: URL Rating (UR) shows the strength of your target page's backlink profile on a 100-point logarithmic scale. If you analyze a domain, the homepage's UR is shown.   \ntype: number<float> nullable  \n\n",
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc See response schema for valid column identifiers.",
                    "type": "string"
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                },
                "targets": {
                    "description": "A list of targets to do batch analysis.",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [
                            "url",
                            "mode",
                            "protocol"
                        ],
                        "properties": {
                            "url": {
                                "description": "The URL of the analyzed target.",
                                "type": "string"
                            },
                            "mode": {
                                "description": "The target mode used for the analysis.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                                "type": "string",
                                "enum": [
                                    "exact",
                                    "prefix",
                                    "domain",
                                    "subdomains"
                                ]
                            },
                            "protocol": {
                                "description": "The protocol of the target.",
                                "type": "string",
                                "enum": [
                                    "both",
                                    "http",
                                    "https"
                                ]
                            }
                        }
                    }
                }
            },
            "required": [
                "select",
                "targets"
            ],
            "type": "object"
        },
        "name": "batch-analysis-batch-analysis"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "target_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": false
            },
            {
                "in": "query",
                "name": "target_position",
                "required": false
            },
            {
                "in": "query",
                "name": "country",
                "required": true
            },
            {
                "in": "query",
                "name": "search_engine",
                "required": false
            },
            {
                "in": "query",
                "name": "keywords",
                "required": false
            },
            {
                "in": "query",
                "name": "keyword_list_id",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "keywords-explorer/overview",
        "_original_request_body": null,
        "description": "Provides an overview of keyword metrics—including search volume, CPC, ranking difficulty, traffic potential, and intent—for specified keywords, domains, or URLs within a given country. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "target_mode": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "target_position": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "keywords": {
                    "type": "string"
                },
                "keyword_list_id": {
                    "type": "integer"
                }
            },
            "required": [
                "select",
                "country"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**clicks**: The average monthly number of clicks on the search results that people make while searching for the target keyword.  \ntype: integer nullable  \n\n**cpc**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents.  \ntype: integer nullable  \n\n**cps**: Clicks Per Search (or CPS) is the ratio of Clicks to Keyword Search volume. It shows how many different search results get clicked, on average, when people search for the target keyword in a given country.  \ntype: number<float> nullable  \n\n**difficulty**: (10 units) An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable  \n\n**first_seen**: The date when we first checked search engine results for a keyword.  \ntype: string<date-time> nullable  \n\n**global_volume**: (10 units) How many times per month, on average, people search for the target keyword across all countries in our database.  \ntype: integer nullable  \n\n**intents**: (10 units) Indicates the purpose behind the user's search query. Object fields: `informational`, `navigational`, `commercial`, `transactional`, `branded` or `local`. All the fields are of type `bool`, with posible values `true` or `false`.  \ntype: object nullable  \n\n**keyword**  \ntype: string  \n\n**parent_topic**: Parent Topic determines if you can rank for your target keyword while targeting a more general topic on your page instead. To identify the Parent Topic, we take the #1 ranking page for your keyword and find the keyword responsible for sending the most traffic to that page.  \ntype: string nullable  \n\n**parent_volume**: (10 units) The search volume of the parent topic.  \ntype: integer nullable  \n\n**searches_pct_clicks_organic_and_paid**: The average monthly percentage of people who clicked on both organic and paid results while searching for the target keyword.  \ntype: number<float> nullable  \n\n**searches_pct_clicks_organic_only**: The average monthly percentage of people who clicked only on organic results while searching for the target keyword.  \ntype: number<float> nullable  \n\n**searches_pct_clicks_paid_only**: The average monthly percentage of people who clicked only on paid results while searching for the target keyword.  \ntype: number<float> nullable  \n\n**serp_features**: The enriched results on a search engine results page (SERP) that are not traditional organic results.  \ntype: array[string]  \nenum: `\"ai_overview_sitelink\"` `\"snippet\"` `\"ai_overview\"` `\"local_pack\"` `\"sitelink\"` `\"news\"` `\"image\"` `\"video\"` `\"discussion\"` `\"tweet\"` `\"paid_top\"` `\"paid_bottom\"` `\"paid_sitelink\"` `\"shopping\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"question\"` `\"image_th\"` `\"video_th\"` `\"organic_shopping\"`  \n\n**serp_last_update**: The date when we last checked search engine results for a keyword.  \ntype: string<date-time> nullable  \n\n**traffic_potential**: (10 units) The sum of organic traffic that the #1 ranking page for your target keyword receives from all the keywords that it ranks for.  \ntype: integer nullable  \n\n**volume**: (10 units) An estimation of the average monthly number of searches for a keyword over the latest known 12 months of data.  \ntype: integer nullable  \n\n**volume_desktop_pct**: The percentage of searches for a keyword performed on desktop devices.  \ntype: number<float> nullable  \n\n**volume_mobile_pct**: The percentage of searches for a keyword performed on mobile devices.  \ntype: number<float> nullable  \n\n**volume_monthly**: (10 units) An estimation of the number of searches for a keyword over the latest month.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: Only * as a wildcard operator..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**clicks**: The average monthly number of clicks on the search results that people make while searching for the target keyword.  \ntype: integer nullable\n\n**cpc**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents.  \ntype: integer nullable\n\n**cps**: Clicks Per Search (or CPS) is the ratio of Clicks to Keyword Search volume. It shows how many different search results get clicked, on average, when people search for the target keyword in a given country.  \ntype: float nullable\n\n**difficulty** (10 units): An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable\n\n**first_seen**: The date when we first checked search engine results for a keyword.  \ntype: datetime nullable\n\n**global_volume** (10 units): How many times per month, on average, people search for the target keyword across all countries in our database.  \ntype: integer nullable\n\n**intents** (10 units): Indicates the purpose behind the user's search query. Object fields: `informational`, `navigational`, `commercial`, `transactional`, `branded` or `local`. All the fields are of type `bool`, with posible values `true` or `false`.  \ntype: object nullable\n\n**keyword**:   \ntype: string\n\n**parent_topic**: Parent Topic determines if you can rank for your target keyword while targeting a more general topic on your page instead. To identify the Parent Topic, we take the #1 ranking page for your keyword and find the keyword responsible for sending the most traffic to that page.  \ntype: string nullable\n\n**parent_volume** (10 units): The search volume of the parent topic.  \ntype: integer nullable\n\n**serp_domain_rating_top10_min**: The keyword must have at least one ranking position in the top 10 results with a DR of up to this value.  \ntype: float nullable\n\n**serp_domain_rating_top5_min**: The keyword must have at least one ranking position in the top 5 results with a DR of up to this value.  \ntype: float nullable\n\n**serp_features**: The enriched results on a search engine results page (SERP) that are not traditional organic results.  \ntype: array(string)  \nenum: `\"ai_overview_sitelink\"` `\"snippet\"` `\"ai_overview\"` `\"local_pack\"` `\"sitelink\"` `\"news\"` `\"image\"` `\"video\"` `\"discussion\"` `\"tweet\"` `\"paid_top\"` `\"paid_bottom\"` `\"paid_sitelink\"` `\"shopping\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"question\"` `\"image_th\"` `\"video_th\"` `\"organic_shopping\"`\n\n**serp_last_update**: The date when we last checked search engine results for a keyword.  \ntype: datetime nullable\n\n**traffic_potential** (10 units): The sum of organic traffic that the #1 ranking page for your target keyword receives from all the keywords that it ranks for.  \ntype: integer nullable\n\n**volume** (10 units): An estimation of the average monthly number of searches for a keyword over the latest known 12 months of data.  \ntype: integer nullable\n\n**volume_desktop_pct**: The percentage of searches for a keyword performed on desktop devices.  \ntype: float nullable\n\n**volume_mobile_pct**: The percentage of searches for a keyword performed on mobile devices.  \ntype: float nullable\n\n**word_count**:   \ntype: integer",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "target_mode": {
                    "description": "The scope of the target URL you specified.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "target_position": {
                    "description": "Filters keywords based on the ranking position of the specified `target`.",
                    "type": "string",
                    "enum": [
                        "in_top10",
                        "in_top100"
                    ]
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "keywords": {
                    "description": "A comma-separated list of keywords to show metrics for.",
                    "type": "string"
                },
                "keyword_list_id": {
                    "description": "The id of an existing keyword list to show metrics for.",
                    "type": "integer"
                }
            },
            "required": [
                "select",
                "country"
            ],
            "type": "object"
        },
        "name": "keywords-explorer-overview"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "date_to",
                "required": false
            },
            {
                "in": "query",
                "name": "date_from",
                "required": false
            },
            {
                "in": "query",
                "name": "country",
                "required": true
            },
            {
                "in": "query",
                "name": "keyword",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "keywords-explorer/volume-history",
        "_original_request_body": null,
        "description": "Retrieves historical search volume data for a specified keyword within a given country and date range. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "date_to": {
                    "type": "string"
                },
                "date_from": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "keyword": {
                    "type": "string"
                }
            },
            "required": [
                "country",
                "keyword"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "date_to": {
                    "description": "The end date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date_from": {
                    "description": "The start date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "keyword": {
                    "description": "The keyword to show metrics for.",
                    "type": "string"
                }
            },
            "required": [
                "country",
                "keyword"
            ],
            "type": "object"
        },
        "name": "keywords-explorer-volume-history"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "search_engine",
                "required": false
            },
            {
                "in": "query",
                "name": "keyword",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "keywords-explorer/volume-by-country",
        "_original_request_body": null,
        "description": "Retrieves search volume metrics for a specified keyword broken down by country. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "limit": {
                    "type": "integer"
                },
                "keyword": {
                    "type": "string"
                }
            },
            "required": [
                "keyword"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "keyword": {
                    "description": "The keyword to show metrics for.",
                    "type": "string"
                }
            },
            "required": [
                "keyword"
            ],
            "type": "object"
        },
        "name": "keywords-explorer-volume-by-country"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "country",
                "required": true
            },
            {
                "in": "query",
                "name": "search_engine",
                "required": false
            },
            {
                "in": "query",
                "name": "keywords",
                "required": false
            },
            {
                "in": "query",
                "name": "keyword_list_id",
                "required": false
            },
            {
                "in": "query",
                "name": "match_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "terms",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "keywords-explorer/matching-terms",
        "_original_request_body": null,
        "description": "Retrieves keyword ideas and their associated SEO metrics by matching input terms or phrases in a specified country, with extensive support for filtering, sorting, and metric selection. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "keywords": {
                    "type": "string"
                },
                "keyword_list_id": {
                    "type": "integer"
                },
                "match_mode": {
                    "type": "string"
                },
                "terms": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "country"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**cpc**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents.  \ntype: integer nullable  \n\n**cps**: Clicks Per Search (or CPS) is the ratio of Clicks to Keyword Search volume. It shows how many different search results get clicked, on average, when people search for the target keyword in a given country.  \ntype: number<float> nullable  \n\n**difficulty**: (10 units) An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable  \n\n**first_seen**: The date when we first checked search engine results for a keyword.  \ntype: string<date-time> nullable  \n\n**global_volume**: (10 units) How many times per month, on average, people search for the target keyword across all countries in our database.  \ntype: integer nullable  \n\n**intents**: (10 units) Indicates the purpose behind the user's search query. Object fields: `informational`, `navigational`, `commercial`, `transactional`, `branded` or `local`. All the fields are of type `bool`, with posible values `true` or `false`.  \ntype: object nullable  \n\n**keyword**  \ntype: string  \n\n**parent_topic**: Parent Topic determines if you can rank for your target keyword while targeting a more general topic on your page instead. To identify the Parent Topic, we take the #1 ranking page for your keyword and find the keyword responsible for sending the most traffic to that page.  \ntype: string nullable  \n\n**serp_features**: The enriched results on a search engine results page (SERP) that are not traditional organic results.  \ntype: array[string]  \nenum: `\"ai_overview_sitelink\"` `\"snippet\"` `\"ai_overview\"` `\"local_pack\"` `\"sitelink\"` `\"news\"` `\"image\"` `\"video\"` `\"discussion\"` `\"tweet\"` `\"paid_top\"` `\"paid_bottom\"` `\"paid_sitelink\"` `\"shopping\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"question\"` `\"image_th\"` `\"video_th\"` `\"organic_shopping\"`  \n\n**serp_last_update**: The date when we last checked search engine results for a keyword.  \ntype: string<date-time> nullable  \n\n**traffic_potential**: (10 units) The sum of organic traffic that the #1 ranking page for your target keyword receives from all the keywords that it ranks for.  \ntype: integer nullable  \n\n**volume**: (10 units) An estimation of the average monthly number of searches for a keyword over the latest known 12 months of data.  \ntype: integer nullable  \n\n**volume_desktop_pct**: The percentage of searches for a keyword performed on desktop devices.  \ntype: number<float> nullable  \n\n**volume_mobile_pct**: The percentage of searches for a keyword performed on mobile devices.  \ntype: number<float> nullable  \n\n**volume_monthly**: (10 units) An estimation of the number of searches for a keyword over the latest month.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: Only * as a wildcard operator..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**cpc**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents.  \ntype: integer nullable\n\n**cps**: Clicks Per Search (or CPS) is the ratio of Clicks to Keyword Search volume. It shows how many different search results get clicked, on average, when people search for the target keyword in a given country.  \ntype: float nullable\n\n**difficulty** (10 units): An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable\n\n**first_seen**: The date when we first checked search engine results for a keyword.  \ntype: datetime nullable\n\n**global_volume** (10 units): How many times per month, on average, people search for the target keyword across all countries in our database.  \ntype: integer nullable\n\n**intents** (10 units): Indicates the purpose behind the user's search query. Object fields: `informational`, `navigational`, `commercial`, `transactional`, `branded` or `local`. All the fields are of type `bool`, with posible values `true` or `false`.  \ntype: object nullable\n\n**keyword**:   \ntype: string\n\n**parent_topic**: Parent Topic determines if you can rank for your target keyword while targeting a more general topic on your page instead. To identify the Parent Topic, we take the #1 ranking page for your keyword and find the keyword responsible for sending the most traffic to that page.  \ntype: string nullable\n\n**serp_domain_rating_top10_min**: The keyword must have at least one ranking position in the top 10 results with a DR of up to this value.  \ntype: float nullable\n\n**serp_domain_rating_top5_min**: The keyword must have at least one ranking position in the top 5 results with a DR of up to this value.  \ntype: float nullable\n\n**serp_features**: The enriched results on a search engine results page (SERP) that are not traditional organic results.  \ntype: array(string)  \nenum: `\"ai_overview_sitelink\"` `\"snippet\"` `\"ai_overview\"` `\"local_pack\"` `\"sitelink\"` `\"news\"` `\"image\"` `\"video\"` `\"discussion\"` `\"tweet\"` `\"paid_top\"` `\"paid_bottom\"` `\"paid_sitelink\"` `\"shopping\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"question\"` `\"image_th\"` `\"video_th\"` `\"organic_shopping\"`\n\n**serp_last_update**: The date when we last checked search engine results for a keyword.  \ntype: datetime nullable\n\n**traffic_potential** (10 units): The sum of organic traffic that the #1 ranking page for your target keyword receives from all the keywords that it ranks for.  \ntype: integer nullable\n\n**volume** (10 units): An estimation of the average monthly number of searches for a keyword over the latest known 12 months of data.  \ntype: integer nullable\n\n**volume_desktop_pct**: The percentage of searches for a keyword performed on desktop devices.  \ntype: float nullable\n\n**volume_mobile_pct**: The percentage of searches for a keyword performed on mobile devices.  \ntype: float nullable\n\n**word_count**:   \ntype: integer",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "keywords": {
                    "description": "A comma-separated list of keywords to show metrics for.",
                    "type": "string"
                },
                "keyword_list_id": {
                    "description": "The id of an existing keyword list to show metrics for.",
                    "type": "integer"
                },
                "match_mode": {
                    "description": "Keyword ideas contain the words from your query in any order (terms mode) or in the exact order they are written (phrase mode).",
                    "type": "string",
                    "enum": [
                        "terms",
                        "phrase"
                    ]
                },
                "terms": {
                    "description": "All keywords ideas or keywords ideas phrased as questions.",
                    "type": "string",
                    "enum": [
                        "all",
                        "questions"
                    ]
                }
            },
            "required": [
                "select",
                "country"
            ],
            "type": "object"
        },
        "name": "keywords-explorer-matching-terms"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "country",
                "required": true
            },
            {
                "in": "query",
                "name": "keywords",
                "required": false
            },
            {
                "in": "query",
                "name": "keyword_list_id",
                "required": false
            },
            {
                "in": "query",
                "name": "view_for",
                "required": false
            },
            {
                "in": "query",
                "name": "terms",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "keywords-explorer/related-terms",
        "_original_request_body": null,
        "description": "Returns keyword metrics and related terms—such as \"also rank for\" keywords and \"also talk about\" keywords—for a given keyword or keyword list, with filtering and sorting options. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "keywords": {
                    "type": "string"
                },
                "keyword_list_id": {
                    "type": "integer"
                },
                "view_for": {
                    "type": "string"
                },
                "terms": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "country"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**cpc**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents.  \ntype: integer nullable  \n\n**cps**: Clicks Per Search (or CPS) is the ratio of Clicks to Keyword Search volume. It shows how many different search results get clicked, on average, when people search for the target keyword in a given country.  \ntype: number<float> nullable  \n\n**difficulty**: (10 units) An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable  \n\n**first_seen**: The date when we first checked search engine results for a keyword.  \ntype: string<date-time> nullable  \n\n**global_volume**: (10 units) How many times per month, on average, people search for the target keyword across all countries in our database.  \ntype: integer nullable  \n\n**intents**: (10 units) Indicates the purpose behind the user's search query. Object fields: `informational`, `navigational`, `commercial`, `transactional`, `branded` or `local`. All the fields are of type `bool`, with posible values `true` or `false`.  \ntype: object nullable  \n\n**keyword**  \ntype: string  \n\n**parent_topic**: Parent Topic determines if you can rank for your target keyword while targeting a more general topic on your page instead. To identify the Parent Topic, we take the #1 ranking page for your keyword and find the keyword responsible for sending the most traffic to that page.  \ntype: string nullable  \n\n**serp_features**: The enriched results on a search engine results page (SERP) that are not traditional organic results.  \ntype: array[string]  \nenum: `\"ai_overview_sitelink\"` `\"snippet\"` `\"ai_overview\"` `\"local_pack\"` `\"sitelink\"` `\"news\"` `\"image\"` `\"video\"` `\"discussion\"` `\"tweet\"` `\"paid_top\"` `\"paid_bottom\"` `\"paid_sitelink\"` `\"shopping\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"question\"` `\"image_th\"` `\"video_th\"` `\"organic_shopping\"`  \n\n**serp_last_update**: The date when we last checked search engine results for a keyword.  \ntype: string<date-time> nullable  \n\n**traffic_potential**: (10 units) The sum of organic traffic that the #1 ranking page for your target keyword receives from all the keywords that it ranks for.  \ntype: integer nullable  \n\n**volume**: (10 units) An estimation of the average monthly number of searches for a keyword over the latest known 12 months of data.  \ntype: integer nullable  \n\n**volume_desktop_pct**: The percentage of searches for a keyword performed on desktop devices.  \ntype: number<float> nullable  \n\n**volume_mobile_pct**: The percentage of searches for a keyword performed on mobile devices.  \ntype: number<float> nullable  \n\n**volume_monthly**: (10 units) An estimation of the number of searches for a keyword over the latest month.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: Only * as a wildcard operator..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**cpc**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents.  \ntype: integer nullable\n\n**cps**: Clicks Per Search (or CPS) is the ratio of Clicks to Keyword Search volume. It shows how many different search results get clicked, on average, when people search for the target keyword in a given country.  \ntype: float nullable\n\n**difficulty** (10 units): An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable\n\n**first_seen**: The date when we first checked search engine results for a keyword.  \ntype: datetime nullable\n\n**global_volume** (10 units): How many times per month, on average, people search for the target keyword across all countries in our database.  \ntype: integer nullable\n\n**intents** (10 units): Indicates the purpose behind the user's search query. Object fields: `informational`, `navigational`, `commercial`, `transactional`, `branded` or `local`. All the fields are of type `bool`, with posible values `true` or `false`.  \ntype: object nullable\n\n**keyword**:   \ntype: string\n\n**parent_topic**: Parent Topic determines if you can rank for your target keyword while targeting a more general topic on your page instead. To identify the Parent Topic, we take the #1 ranking page for your keyword and find the keyword responsible for sending the most traffic to that page.  \ntype: string nullable\n\n**serp_domain_rating_top10_min**: The keyword must have at least one ranking position in the top 10 results with a DR of up to this value.  \ntype: float nullable\n\n**serp_domain_rating_top5_min**: The keyword must have at least one ranking position in the top 5 results with a DR of up to this value.  \ntype: float nullable\n\n**serp_features**: The enriched results on a search engine results page (SERP) that are not traditional organic results.  \ntype: array(string)  \nenum: `\"ai_overview_sitelink\"` `\"snippet\"` `\"ai_overview\"` `\"local_pack\"` `\"sitelink\"` `\"news\"` `\"image\"` `\"video\"` `\"discussion\"` `\"tweet\"` `\"paid_top\"` `\"paid_bottom\"` `\"paid_sitelink\"` `\"shopping\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"question\"` `\"image_th\"` `\"video_th\"` `\"organic_shopping\"`\n\n**serp_last_update**: The date when we last checked search engine results for a keyword.  \ntype: datetime nullable\n\n**traffic_potential** (10 units): The sum of organic traffic that the #1 ranking page for your target keyword receives from all the keywords that it ranks for.  \ntype: integer nullable\n\n**volume** (10 units): An estimation of the average monthly number of searches for a keyword over the latest known 12 months of data.  \ntype: integer nullable\n\n**volume_desktop_pct**: The percentage of searches for a keyword performed on desktop devices.  \ntype: float nullable\n\n**volume_mobile_pct**: The percentage of searches for a keyword performed on mobile devices.  \ntype: float nullable\n\n**word_count**:   \ntype: integer",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "keywords": {
                    "description": "A comma-separated list of keywords to show metrics for.",
                    "type": "string"
                },
                "keyword_list_id": {
                    "description": "The id of an existing keyword list to show metrics for.",
                    "type": "integer"
                },
                "view_for": {
                    "description": "View keywords for the top 10 or top 100 ranking pages.",
                    "type": "string",
                    "enum": [
                        "top_10",
                        "top_100"
                    ]
                },
                "terms": {
                    "description": "Related keywords which top-ranking pages also rank for (`also_rank_for`), additional keywords frequently mentioned in top-ranking pages (`also_talk_about`), or combination of both (`all`).",
                    "type": "string",
                    "enum": [
                        "also_rank_for",
                        "also_talk_about",
                        "all"
                    ]
                }
            },
            "required": [
                "select",
                "country"
            ],
            "type": "object"
        },
        "name": "keywords-explorer-related-terms"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "country",
                "required": true
            },
            {
                "in": "query",
                "name": "search_engine",
                "required": false
            },
            {
                "in": "query",
                "name": "keywords",
                "required": false
            },
            {
                "in": "query",
                "name": "keyword_list_id",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "keywords-explorer/search-suggestions",
        "_original_request_body": null,
        "description": "Provides keyword search suggestions and related keyword metrics (e.g., search volume, difficulty, CPC) for specified queries or keyword lists, with options to filter, sort, and customize returned fields by country. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "keywords": {
                    "type": "string"
                },
                "keyword_list_id": {
                    "type": "integer"
                }
            },
            "required": [
                "select",
                "country"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**cpc**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents.  \ntype: integer nullable  \n\n**cps**: Clicks Per Search (or CPS) is the ratio of Clicks to Keyword Search volume. It shows how many different search results get clicked, on average, when people search for the target keyword in a given country.  \ntype: number<float> nullable  \n\n**difficulty**: (10 units) An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable  \n\n**first_seen**: The date when we first checked search engine results for a keyword.  \ntype: string<date-time> nullable  \n\n**global_volume**: (10 units) How many times per month, on average, people search for the target keyword across all countries in our database.  \ntype: integer nullable  \n\n**intents**: (10 units) Indicates the purpose behind the user's search query. Object fields: `informational`, `navigational`, `commercial`, `transactional`, `branded` or `local`. All the fields are of type `bool`, with posible values `true` or `false`.  \ntype: object nullable  \n\n**keyword**  \ntype: string  \n\n**parent_topic**: Parent Topic determines if you can rank for your target keyword while targeting a more general topic on your page instead. To identify the Parent Topic, we take the #1 ranking page for your keyword and find the keyword responsible for sending the most traffic to that page.  \ntype: string nullable  \n\n**serp_features**: The enriched results on a search engine results page (SERP) that are not traditional organic results.  \ntype: array[string]  \nenum: `\"ai_overview_sitelink\"` `\"snippet\"` `\"ai_overview\"` `\"local_pack\"` `\"sitelink\"` `\"news\"` `\"image\"` `\"video\"` `\"discussion\"` `\"tweet\"` `\"paid_top\"` `\"paid_bottom\"` `\"paid_sitelink\"` `\"shopping\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"question\"` `\"image_th\"` `\"video_th\"` `\"organic_shopping\"`  \n\n**serp_last_update**: The date when we last checked search engine results for a keyword.  \ntype: string<date-time> nullable  \n\n**traffic_potential**: (10 units) The sum of organic traffic that the #1 ranking page for your target keyword receives from all the keywords that it ranks for.  \ntype: integer nullable  \n\n**volume**: (10 units) An estimation of the average monthly number of searches for a keyword over the latest known 12 months of data.  \ntype: integer nullable  \n\n**volume_desktop_pct**: The percentage of searches for a keyword performed on desktop devices.  \ntype: number<float> nullable  \n\n**volume_mobile_pct**: The percentage of searches for a keyword performed on mobile devices.  \ntype: number<float> nullable  \n\n**volume_monthly**: (10 units) An estimation of the number of searches for a keyword over the latest month.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: Only * as a wildcard operator..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**cpc**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents.  \ntype: integer nullable\n\n**cps**: Clicks Per Search (or CPS) is the ratio of Clicks to Keyword Search volume. It shows how many different search results get clicked, on average, when people search for the target keyword in a given country.  \ntype: float nullable\n\n**difficulty** (10 units): An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable\n\n**first_seen**: The date when we first checked search engine results for a keyword.  \ntype: datetime nullable\n\n**global_volume** (10 units): How many times per month, on average, people search for the target keyword across all countries in our database.  \ntype: integer nullable\n\n**intents** (10 units): Indicates the purpose behind the user's search query. Object fields: `informational`, `navigational`, `commercial`, `transactional`, `branded` or `local`. All the fields are of type `bool`, with posible values `true` or `false`.  \ntype: object nullable\n\n**keyword**:   \ntype: string\n\n**parent_topic**: Parent Topic determines if you can rank for your target keyword while targeting a more general topic on your page instead. To identify the Parent Topic, we take the #1 ranking page for your keyword and find the keyword responsible for sending the most traffic to that page.  \ntype: string nullable\n\n**serp_domain_rating_top10_min**: The keyword must have at least one ranking position in the top 10 results with a DR of up to this value.  \ntype: float nullable\n\n**serp_domain_rating_top5_min**: The keyword must have at least one ranking position in the top 5 results with a DR of up to this value.  \ntype: float nullable\n\n**serp_features**: The enriched results on a search engine results page (SERP) that are not traditional organic results.  \ntype: array(string)  \nenum: `\"ai_overview_sitelink\"` `\"snippet\"` `\"ai_overview\"` `\"local_pack\"` `\"sitelink\"` `\"news\"` `\"image\"` `\"video\"` `\"discussion\"` `\"tweet\"` `\"paid_top\"` `\"paid_bottom\"` `\"paid_sitelink\"` `\"shopping\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"question\"` `\"image_th\"` `\"video_th\"` `\"organic_shopping\"`\n\n**serp_last_update**: The date when we last checked search engine results for a keyword.  \ntype: datetime nullable\n\n**traffic_potential** (10 units): The sum of organic traffic that the #1 ranking page for your target keyword receives from all the keywords that it ranks for.  \ntype: integer nullable\n\n**volume** (10 units): An estimation of the average monthly number of searches for a keyword over the latest known 12 months of data.  \ntype: integer nullable\n\n**volume_desktop_pct**: The percentage of searches for a keyword performed on desktop devices.  \ntype: float nullable\n\n**volume_mobile_pct**: The percentage of searches for a keyword performed on mobile devices.  \ntype: float nullable\n\n**word_count**:   \ntype: integer",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "keywords": {
                    "description": "A comma-separated list of keywords to show metrics for.",
                    "type": "string"
                },
                "keyword_list_id": {
                    "description": "The id of an existing keyword list to show metrics for.",
                    "type": "integer"
                }
            },
            "required": [
                "select",
                "country"
            ],
            "type": "object"
        },
        "name": "keywords-explorer-search-suggestions"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-audit/projects",
        "_original_request_body": null,
        "description": "Retrieves a list of site audit projects available in the system. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {},
            "required": [],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {},
            "required": [],
            "type": "object"
        },
        "name": "site-audit-projects"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "owned_by",
                "required": false
            },
            {
                "in": "query",
                "name": "access",
                "required": false
            },
            {
                "in": "query",
                "name": "has_keywords",
                "required": false
            },
            {
                "in": "query",
                "name": "project_id",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "management/projects",
        "_original_request_body": null,
        "description": "Retrieves information about existing projects, including ownership, access type, presence of Rank Tracker keywords, and project ID. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "owned_by": {
                    "type": "string"
                },
                "access": {
                    "type": "string"
                },
                "has_keywords": {
                    "type": "boolean"
                },
                "project_id": {
                    "type": "integer"
                }
            },
            "required": [],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "owned_by": {
                    "description": "The email of the project owner.",
                    "type": "string"
                },
                "access": {
                    "description": "The access type of the project.",
                    "type": "string",
                    "enum": [
                        "private",
                        "shared"
                    ]
                },
                "has_keywords": {
                    "description": "Has Rank Tracker keywords.",
                    "type": "boolean"
                },
                "project_id": {
                    "description": "The unique identifier of the project. You can find it in the URL of your Rank Tracker project in Ahrefs: `https://app.ahrefs.com/rank-tracker/overview/#project_id#`",
                    "type": "integer"
                }
            },
            "required": [],
            "type": "object"
        },
        "name": "management-projects"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "project_id",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "management/project-keywords",
        "_original_request_body": null,
        "description": "Retrieves keywords associated with a specific project in Ahrefs' Rank Tracker by project ID. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "project_id": {
                    "type": "integer"
                }
            },
            "required": [
                "project_id"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "project_id": {
                    "description": "The unique identifier of the project. You can find it in the URL of your Rank Tracker project in Ahrefs: `https://app.ahrefs.com/rank-tracker/overview/#project_id#`",
                    "type": "integer"
                }
            },
            "required": [
                "project_id"
            ],
            "type": "object"
        },
        "name": "management-project-keywords"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "us_state",
                "required": false
            },
            {
                "in": "query",
                "name": "country_code",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "management/locations",
        "_original_request_body": null,
        "description": "Retrieves a list of management locations filtered by country code and optionally by US state. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "us_state": {
                    "type": "string"
                },
                "country_code": {
                    "type": "string"
                }
            },
            "required": [
                "country_code"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "us_state": {
                    "description": "A two-letter US state code (ISO 3166-2:US): \"AL\" .. \"WY\". Required only if `country_code` is set to `US`",
                    "type": "string"
                },
                "country_code": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                }
            },
            "required": [
                "country_code"
            ],
            "type": "object"
        },
        "name": "management-locations"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "project_id",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "management/project-competitors",
        "_original_request_body": null,
        "description": "Retrieves the list of competitors associated with a specific Rank Tracker project in Ahrefs, using the project's unique identifier. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "project_id": {
                    "type": "integer"
                }
            },
            "required": [
                "project_id"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "project_id": {
                    "description": "The unique identifier of the project. You can find it in the URL of your Rank Tracker project in Ahrefs: `https://app.ahrefs.com/rank-tracker/overview/#project_id#`",
                    "type": "integer"
                }
            },
            "required": [
                "project_id"
            ],
            "type": "object"
        },
        "name": "management-project-competitors"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "top_positions",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": false
            },
            {
                "in": "query",
                "name": "country",
                "required": true
            },
            {
                "in": "query",
                "name": "keyword",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "serp-overview/serp-overview",
        "_original_request_body": null,
        "description": "Returns an overview of the top search results (SERP) for a specified keyword and country, including detailed metrics about each result like position, backlinks, traffic, domain rating, and related keywords. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "select": {
                    "type": "string"
                },
                "top_positions": {
                    "type": "integer"
                },
                "date": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "keyword": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "country",
                "keyword"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c\n\nResponse schema:**ahrefs_rank**: The strength of a domain's backlink profile compared to the other websites in our database, with rank #1 being the strongest.  \ntype: integer nullable  \n\n**backlinks**: The total number of links from other websites pointing to a search result.  \ntype: integer nullable  \n\n**domain_rating**: The strength of a domain’s backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float> nullable  \n\n**keywords**: The total number of keywords that a search result ranks for in the top 100 organic positions.  \ntype: integer nullable  \n\n**position**: The position of the search result in SERP.  \ntype: integer  \n\n**refdomains**: (5 units) The total number of unique domains linking to a search result.  \ntype: integer nullable  \n\n**title**: The title of a ranking page.  \ntype: string nullable  \n\n**top_keyword**: The keyword that brings the most organic traffic to a search result.  \ntype: string nullable  \n\n**top_keyword_volume**: (10 units) An estimation of the average monthly number of searches for the top keyword over the latest known 12 months of data.  \ntype: integer nullable  \n\n**traffic**: (10 units) An estimation of the monthly organic search traffic that a result gets from all the keywords that it ranks for.  \ntype: integer nullable  \n\n**type**: The kind of the position: organic, paid, or a SERP feature.  \ntype: array[string]  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"`  \n\n**update_date**: The date when we checked search engine results for a keyword.  \ntype: string<date-time>  \n\n**url**: The URL of a ranking page.  \ntype: string nullable  \n\n**url_rating**: The strength of a page's backlink profile on a 100-point logarithmic scale.  \ntype: number<float> nullable  \n\n**value**: (10 units) The estimated value of a page’s monthly organic search traffic, in USD cents.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "top_positions": {
                    "description": "The number of top organic SERP positions to return. If not specified, all available positions will be returned.",
                    "type": "integer"
                },
                "date": {
                    "description": "A timestamp on which the last available SERP Overview is returned in YYYY-MM-DDThh:mm:ss format. If it is not specified, the most recent SERP Overview is returned.",
                    "type": "string",
                    "format": "date-time"
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "keyword": {
                    "description": "The keyword to return SERP Overview for.",
                    "type": "string"
                }
            },
            "required": [
                "select",
                "country",
                "keyword"
            ],
            "type": "object"
        },
        "name": "serp-overview-serp-overview"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/domain-rating",
        "_original_request_body": null,
        "description": "Retrieves the domain rating and related metrics for a specified domain or URL as of a specific date. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                }
            },
            "required": [
                "target",
                "date"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                }
            },
            "required": [
                "target",
                "date"
            ],
            "type": "object"
        },
        "name": "site-explorer-domain-rating"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/backlinks-stats",
        "_original_request_body": null,
        "description": "Provides backlink statistics for a specified URL or domain as of a given date, with options to control protocol and scope. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                }
            },
            "required": [
                "target",
                "date"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                }
            },
            "required": [
                "target",
                "date"
            ],
            "type": "object"
        },
        "name": "site-explorer-backlinks-stats"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/outlinks-stats",
        "_original_request_body": null,
        "description": "Retrieves statistical data about the outbound links (outlinks) from a specified URL, domain, or site section. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "protocol": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                }
            },
            "required": [
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                }
            },
            "required": [
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-outlinks-stats"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "country",
                "required": false
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/metrics",
        "_original_request_body": null,
        "description": "Provides SEO performance metrics for a specified domain, URL, or site section as of a given date, with options to customize search scope, protocol, country, and search volume mode. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "volume_mode": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                }
            },
            "required": [
                "target",
                "date"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                }
            },
            "required": [
                "target",
                "date"
            ],
            "type": "object"
        },
        "name": "site-explorer-metrics"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "history_grouping",
                "required": false
            },
            {
                "in": "query",
                "name": "date_to",
                "required": false
            },
            {
                "in": "query",
                "name": "date_from",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/refdomains-history",
        "_original_request_body": null,
        "description": "Provides historical data on referring domains linking to a specified target (domain or URL) over a defined date range, with customizable grouping and analysis scope. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "history_grouping": {
                    "type": "string"
                },
                "date_to": {
                    "type": "string"
                },
                "date_from": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "history_grouping": {
                    "description": "The time interval used to group historical data.",
                    "type": "string",
                    "enum": [
                        "daily",
                        "weekly",
                        "monthly"
                    ]
                },
                "date_to": {
                    "description": "The end date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date_from": {
                    "description": "The start date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-refdomains-history"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "history_grouping",
                "required": false
            },
            {
                "in": "query",
                "name": "date_to",
                "required": false
            },
            {
                "in": "query",
                "name": "date_from",
                "required": true
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/domain-rating-history",
        "_original_request_body": null,
        "description": "Retrieves the historical domain rating data for a specified domain or URL over a defined date range and grouping interval. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "history_grouping": {
                    "type": "string"
                },
                "date_to": {
                    "type": "string"
                },
                "date_from": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "history_grouping": {
                    "description": "The time interval used to group historical data.",
                    "type": "string",
                    "enum": [
                        "daily",
                        "weekly",
                        "monthly"
                    ]
                },
                "date_to": {
                    "description": "The end date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date_from": {
                    "description": "The start date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-domain-rating-history"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "history_grouping",
                "required": false
            },
            {
                "in": "query",
                "name": "date_to",
                "required": false
            },
            {
                "in": "query",
                "name": "date_from",
                "required": true
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/url-rating-history",
        "_original_request_body": null,
        "description": "Retrieves the historical URL rating data for a specified domain or URL over a defined date range, grouped by a chosen time interval. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "history_grouping": {
                    "type": "string"
                },
                "date_to": {
                    "type": "string"
                },
                "date_from": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "history_grouping": {
                    "description": "The time interval used to group historical data.",
                    "type": "string",
                    "enum": [
                        "daily",
                        "weekly",
                        "monthly"
                    ]
                },
                "date_to": {
                    "description": "The end date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date_from": {
                    "description": "The start date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-url-rating-history"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "history_grouping",
                "required": false
            },
            {
                "in": "query",
                "name": "date_to",
                "required": false
            },
            {
                "in": "query",
                "name": "date_from",
                "required": true
            },
            {
                "in": "query",
                "name": "country",
                "required": false
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/pages-history",
        "_original_request_body": null,
        "description": "Retrieves historical data about pages from a specified domain, URL, or section of a site, grouped by a chosen time interval. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "history_grouping": {
                    "type": "string"
                },
                "date_to": {
                    "type": "string"
                },
                "date_from": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "history_grouping": {
                    "description": "The time interval used to group historical data.",
                    "type": "string",
                    "enum": [
                        "daily",
                        "weekly",
                        "monthly"
                    ]
                },
                "date_to": {
                    "description": "The end date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date_from": {
                    "description": "The start date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-pages-history"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "select",
                "required": false
            },
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "history_grouping",
                "required": false
            },
            {
                "in": "query",
                "name": "date_to",
                "required": false
            },
            {
                "in": "query",
                "name": "date_from",
                "required": true
            },
            {
                "in": "query",
                "name": "country",
                "required": false
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/metrics-history",
        "_original_request_body": null,
        "description": "Retrieves historical data on key organic and paid search traffic and cost metrics for a specified domain, URL, or path over a selectable date range and grouping interval. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "select": {
                    "type": "string"
                },
                "volume_mode": {
                    "type": "string"
                },
                "history_grouping": {
                    "type": "string"
                },
                "date_to": {
                    "type": "string"
                },
                "date_from": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c\n\nResponse schema:**date**  \ntype: string<date>  \n\n**org_cost**: (10 units) The estimated cost of your target's monthly organic search traffic, in USD cents.  \ntype: integer  \n\n**org_traffic**: (10 units) The estimated number of monthly visitors that your target gets from organic search.  \ntype: integer  \n\n**paid_cost**: (10 units) The estimated cost of your target's monthly paid search traffic, in USD cents.  \ntype: integer  \n\n**paid_traffic**: (10 units) The estimated number of monthly visitors that your target gets from paid search.  \ntype: integer  \n\n",
                    "type": "string"
                },
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                },
                "history_grouping": {
                    "description": "The time interval used to group historical data.",
                    "type": "string",
                    "enum": [
                        "daily",
                        "weekly",
                        "monthly"
                    ]
                },
                "date_to": {
                    "description": "The end date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date_from": {
                    "description": "The start date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-metrics-history"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "select",
                "required": false
            },
            {
                "in": "query",
                "name": "history_grouping",
                "required": false
            },
            {
                "in": "query",
                "name": "date_to",
                "required": false
            },
            {
                "in": "query",
                "name": "date_from",
                "required": true
            },
            {
                "in": "query",
                "name": "country",
                "required": false
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/keywords-history",
        "_original_request_body": null,
        "description": "Retrieves historical data on the number of organic keywords a specified website or URL has ranked for, segmented by various search position ranges and grouped by a chosen time interval. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "select": {
                    "type": "string"
                },
                "history_grouping": {
                    "type": "string"
                },
                "date_to": {
                    "type": "string"
                },
                "date_from": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c\n\nResponse schema:**date**  \ntype: string<date>  \n\n**top11_20**: The total number of keywords that your target ranks for in the top 11-20 organic search results.  \ntype: integer  \n\n**top11_plus**: The total number of keywords that your target ranks for in the top 11+ organic search results.  \ntype: integer  \n\n**top21_50**: The total number of keywords that your target ranks for in the top 21-50 organic search results.  \ntype: integer  \n\n**top3**: The total number of keywords that your target ranks for in the top 3 organic search results.  \ntype: integer  \n\n**top4_10**: The total number of keywords that your target ranks for in the top 4-10 organic search results.  \ntype: integer  \n\n**top51_plus**: The total number of keywords that your target ranks for in the top 51+ organic search results.  \ntype: integer  \n\n",
                    "type": "string"
                },
                "history_grouping": {
                    "description": "The time interval used to group historical data.",
                    "type": "string",
                    "enum": [
                        "daily",
                        "weekly",
                        "monthly"
                    ]
                },
                "date_to": {
                    "description": "The end date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date_from": {
                    "description": "The start date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-keywords-history"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "select",
                "required": false
            },
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/metrics-by-country",
        "_original_request_body": null,
        "description": "Provides organic and paid search performance metrics for a specified website, broken down by country, for a specific date. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "select": {
                    "type": "string"
                },
                "volume_mode": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                }
            },
            "required": [
                "target",
                "date"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c\n\nResponse schema:**country**  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`  \n\n**org_cost**: (10 units) The estimated value of your target's monthly organic search traffic, in USD cents.  \ntype: integer nullable  \n\n**org_keywords**: The total number of keywords that your target ranks for in the top 100 organic search results.  \ntype: integer  \n\n**org_keywords_1_3**: The total number of keywords that your target ranks for in the top 3 organic search results.  \ntype: integer  \n\n**org_traffic**: (10 units) The estimated number of monthly visitors that your target gets from organic search.  \ntype: integer  \n\n**paid_cost**: (10 units) The estimated cost of your target's monthly paid search traffic, in USD cents.  \ntype: integer nullable  \n\n**paid_keywords**: The total number of keywords that your target ranks for in paid search results.  \ntype: integer  \n\n**paid_pages**: The total number of pages from a target ranking in the top 100 paid search results.  \ntype: integer  \n\n**paid_traffic**: (10 units) The estimated number of monthly visitors that your target gets from paid search.  \ntype: integer  \n\n",
                    "type": "string"
                },
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                }
            },
            "required": [
                "target",
                "date"
            ],
            "type": "object"
        },
        "name": "site-explorer-metrics-by-country"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "country",
                "required": false
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/pages-by-traffic",
        "_original_request_body": null,
        "description": "Retrieves pages from a specified domain, subdomain, path, or exact URL, ranked by their estimated organic search traffic for a selected country and protocol. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "volume_mode": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                }
            },
            "required": [
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                }
            },
            "required": [
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-pages-by-traffic"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "aggregation",
                "required": false
            },
            {
                "in": "query",
                "name": "history",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/all-backlinks",
        "_original_request_body": null,
        "description": "Retrieves detailed information about all backlinks pointing to a specified URL or domain, with extensive filtering, sorting, selection, and aggregation options. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "aggregation": {
                    "type": "string"
                },
                "history": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**ahrefs_rank_source**: The strength of the referring domain's backlink profile compared to the other websites in our database, with rank #1 being the strongest.  \ntype: integer  \n\n**ahrefs_rank_target**: The strength of the target domain's backlink profile compared to the other websites in our database, with rank #1 being the strongest.  \ntype: integer  \n\n**alt**: The alt attribute of the link.  \ntype: string nullable  \n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string  \n\n**broken_redirect_new_target**: The new destination of a modified redirect.  \ntype: string nullable  \n\n**broken_redirect_reason**: The reason the redirect was considered broken during the last crawl.  \ntype: string nullable  \nenum: `\"droppedmanual\"` `\"droppedtooold\"` `\"dropped\"` `\"codechanged\"` `\"nxdomain\"` `\"robotsdisallowed\"` `\"curlerror\"` `\"invalidtarget\"` `\"nomorecanonical\"` `\"isnowparked\"` `\"targetchanged\"`  \n\n**broken_redirect_source**: The redirecting URL that was modified, causing the redirect to become broken.  \ntype: string nullable  \n\n**class_c**: (5 units) The number of unique class_c subnets linking to the referring page.  \ntype: integer  \n\n**discovered_status**: The reason the link was discovered during the last crawl: the page was crawled for the first time, the link was added to the page, or the link re-appeared after being removed.  \ntype: string nullable  \nenum: `\"pagefound\"` `\"linkfound\"` `\"linkrestored\"`  \n\n**domain_rating_source**: The strength of the referring domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n**domain_rating_target**: The strength of the referring domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n**drop_reason**: The reason we removed the link from our index.  \ntype: string nullable  \nenum: `\"manual\"` `\"noratingunused\"` `\"notop\"` `\"tooold\"` `\"oldunavailable\"` `\"rescursive\"` `\"duplicate\"` `\"nxdomain\"` `\"malformed\"` `\"blockedport\"` `\"disallowed\"` `\"unlinked\"`  \n\n**encoding**: The character set encoding of the referring page HTML.  \ntype: string  \n\n**first_seen**: The date the referring page URL was first discovered.  \ntype: string<date-time>  \n\n**first_seen_link**: The date we first found a backlink to your target on a given referring page.  \ntype: string<date-time>  \n\n**http_code**: The return code from HTTP protocol returned during the referring page crawl.  \ntype: integer  \n\n**http_crawl**: The link was discovered without executing javascript and rendering the page.  \ntype: boolean  \n\n**ip_source**: The referring domain IP address.  \ntype: string nullable  \n\n**is_alternate**: The link with the rel=“alternate” attribute.  \ntype: boolean  \n\n**is_canonical**: The link with the rel=“canonical” attribute.  \ntype: boolean  \n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean  \n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean  \n\n**is_form**: The link was found in a form HTML tag.  \ntype: boolean  \n\n**is_frame**: The link was found in an iframe HTML tag.  \ntype: boolean  \n\n**is_image**: The link is a regular link that has an image inside their href attribute.  \ntype: boolean  \n\n**is_lost**: The link currently does not exist anymore.  \ntype: boolean  \n\n**is_new**: The link was discovered on the last crawl.  \ntype: boolean  \n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean  \n\n**is_redirect**: The link pointing to your target via a redirect.  \ntype: boolean  \n\n**is_redirect_lost**: The redirected link currently does not exist anymore.  \ntype: boolean  \n\n**is_root_source**: The referring domain name is a root domain name.  \ntype: boolean  \n\n**is_root_target**: The target domain name is a root domain name.  \ntype: boolean  \n\n**is_rss**: The link was found in an RSS feed.  \ntype: boolean  \n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean  \n\n**is_text**: The link is a standard href hyperlink.  \ntype: boolean  \n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean  \n\n**js_crawl**: The link was discovered after executing javascript and rendering the page.  \ntype: boolean  \n\n**languages**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array[string]  \n\n**last_seen**: The date we discovered that the link was lost.  \ntype: string<date-time> nullable  \n\n**last_visited**: The date we last verified a live link to your target page.  \ntype: string<date-time>  \n\n**link_group_count**: The number of backlinks that were grouped together based on the aggregation parameter. This field cannot be used with aggregation 'all'.  \ntype: integer  \n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`  \n\n**linked_domains_source_domain**: The number of unique root domains linked from the referring domain.  \ntype: integer  \n\n**linked_domains_source_page**: The number of unique root domains linked from the referring page.  \ntype: integer  \n\n**linked_domains_target_domain**: The number of unique root domains linked from the target domain.  \ntype: integer  \n\n**links_external**: The number of external links from the referring page.  \ntype: integer  \n\n**links_internal**: The number of internal links from the referring page.  \ntype: integer  \n\n**lost_reason**: The reason the link was lost during the last crawl.  \ntype: string nullable  \nenum: `\"removedfromhtml\"` `\"notcanonical\"` `\"noindex\"` `\"pageredirected\"` `\"pageerror\"` `\"lostredirect\"` `\"notfound\"`  \n\n**name_source**: The complete referring domain name, including subdomains.  \ntype: string  \n\n**name_target**: The complete target domain name, including subdomains.  \ntype: string  \n\n**noindex**: The referring page has the noindex meta attribute.  \ntype: boolean  \n\n**page_size**: The size in bytes of the referring page content.  \ntype: integer  \n\n**port_source**: The network port of the referring page URL.  \ntype: integer  \n\n**port_target**: The network port of the target page URL.  \ntype: integer  \n\n**positions**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer  \n\n**powered_by**: Web technologies used to build and serve the referring page content.  \ntype: array[string]  \n\n**redirect_code**: The HTTP status code of a referring page pointing to your target via a redirect.  \ntype: integer nullable  \n\n**redirect_kind**: The HTTP status codes returned by the target redirecting URL or redirect chain.  \ntype: array[integer]  \n\n**refdomains_source**: (5 units) The number of unique referring domains linking to the referring page.  \ntype: integer  \n\n**refdomains_source_domain**: (5 units) The number of unique referring domains linking to the referring domain.  \ntype: integer  \n\n**refdomains_target_domain**: (5 units) The number of unique referring domains linking to the target domain.  \ntype: integer  \n\n**root_name_source**: The root domain name of the referring domain, not including subdomains.  \ntype: string  \n\n**root_name_target**: The root domain name of the target domain, not including subdomains.  \ntype: string  \n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string  \n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string  \n\n**source_page_author**: The author of the referring page.  \ntype: string nullable  \n\n**source_page_publish_date**: the date we identified the page was published  \ntype: string<date> nullable  \n\n**title**: The html title of the referring page.  \ntype: string  \n\n**tld_class_source**: The top level domain class of the referring domain.  \ntype: string  \nenum: `\"gov\"` `\"edu\"` `\"normal\"`  \n\n**tld_class_target**: The top level domain class of the target domain.  \ntype: string  \nenum: `\"gov\"` `\"edu\"` `\"normal\"`  \n\n**traffic**: (10 units) The referring page's estimated monthly organic traffic from search.  \ntype: integer  \n\n**traffic_domain**: (10 units) The referring domain's estimated monthly organic traffic from search.  \ntype: integer  \n\n**url_from**: The URL of the page containing a link to your target.  \ntype: string<url>  \n\n**url_from_plain**: The referring page URL optimized for use as a filter.  \ntype: string  \n\n**url_rating_source**: The strength of the referring page's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array[string<url>]  \n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array[string]  \n\n**url_to**: The URL the backlink points to.  \ntype: string<url>  \n\n**url_to_plain**: The target page URL optimized for use as a filter.  \ntype: string  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**ahrefs_rank_source**: The strength of the referring domain's backlink profile compared to the other websites in our database, with rank #1 being the strongest.  \ntype: integer\n\n**ahrefs_rank_target**: The strength of the target domain's backlink profile compared to the other websites in our database, with rank #1 being the strongest.  \ntype: integer\n\n**alt**: The alt attribute of the link.  \ntype: string nullable\n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string\n\n**broken_redirect_new_target**: The new destination of a modified redirect.  \ntype: string nullable\n\n**broken_redirect_reason**: The reason the redirect was considered broken during the last crawl.  \ntype: string nullable  \nenum: `\"droppedmanual\"` `\"droppedtooold\"` `\"dropped\"` `\"codechanged\"` `\"nxdomain\"` `\"robotsdisallowed\"` `\"curlerror\"` `\"invalidtarget\"` `\"nomorecanonical\"` `\"isnowparked\"` `\"targetchanged\"`\n\n**broken_redirect_source**: The redirecting URL that was modified, causing the redirect to become broken.  \ntype: string nullable\n\n**class_c** (5 units): The number of unique class_c subnets linking to the referring page.  \ntype: integer\n\n**discovered_status**: The reason the link was discovered during the last crawl: the page was crawled for the first time, the link was added to the page, or the link re-appeared after being removed.  \ntype: string nullable  \nenum: `\"pagefound\"` `\"linkfound\"` `\"linkrestored\"`\n\n**domain_rating_source**: The strength of the referring domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**domain_rating_target**: The strength of the referring domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**drop_reason**: The reason we removed the link from our index.  \ntype: string nullable  \nenum: `\"manual\"` `\"noratingunused\"` `\"notop\"` `\"tooold\"` `\"oldunavailable\"` `\"rescursive\"` `\"duplicate\"` `\"nxdomain\"` `\"malformed\"` `\"blockedport\"` `\"disallowed\"` `\"unlinked\"`\n\n**encoding**: The character set encoding of the referring page HTML.  \ntype: string\n\n**first_seen**: The date the referring page URL was first discovered.  \ntype: datetime\n\n**first_seen_link**: The date we first found a backlink to your target on a given referring page.  \ntype: datetime\n\n**http_code**: The return code from HTTP protocol returned during the referring page crawl.  \ntype: integer\n\n**http_crawl**: The link was discovered without executing javascript and rendering the page.  \ntype: boolean\n\n**ip_source**: The referring domain IP address.  \ntype: string nullable\n\n**is_alternate**: The link with the rel=“alternate” attribute.  \ntype: boolean\n\n**is_canonical**: The link with the rel=“canonical” attribute.  \ntype: boolean\n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean\n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean\n\n**is_form**: The link was found in a form HTML tag.  \ntype: boolean\n\n**is_frame**: The link was found in an iframe HTML tag.  \ntype: boolean\n\n**is_homepage_link**: The link was found on the homepage of a referring website.  \ntype: boolean\n\n**is_image**: The link is a regular link that has an image inside their href attribute.  \ntype: boolean\n\n**is_lost**: The link currently does not exist anymore.  \ntype: boolean\n\n**is_new**: The link was discovered on the last crawl.  \ntype: boolean\n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean\n\n**is_non_html**: The link points to a URL with non-HTML content.  \ntype: boolean\n\n**is_redirect**: The link pointing to your target via a redirect.  \ntype: boolean\n\n**is_redirect_lost**: The redirected link currently does not exist anymore.  \ntype: boolean\n\n**is_root_source**: The referring domain name is a root domain name.  \ntype: boolean\n\n**is_root_target**: The target domain name is a root domain name.  \ntype: boolean\n\n**is_rss**: The link was found in an RSS feed.  \ntype: boolean\n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean\n\n**is_text**: The link is a standard href hyperlink.  \ntype: boolean\n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean\n\n**js_crawl**: The link was discovered after executing javascript and rendering the page.  \ntype: boolean\n\n**languages**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**last_seen**: The date we discovered that the link was lost.  \ntype: datetime nullable\n\n**last_visited**: The date we last verified a live link to your target page.  \ntype: datetime\n\n**len_url_redirect**: The number of redirect chain URLs.  \ntype: integer\n\n**link_group_count**: The number of backlinks that were grouped together based on the aggregation parameter. This field cannot be used with aggregation 'all'.  \ntype: integer\n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`\n\n**linked_domains_source_domain**: The number of unique root domains linked from the referring domain.  \ntype: integer\n\n**linked_domains_source_page**: The number of unique root domains linked from the referring page.  \ntype: integer\n\n**linked_domains_target_domain**: The number of unique root domains linked from the target domain.  \ntype: integer\n\n**links_external**: The number of external links from the referring page.  \ntype: integer\n\n**links_internal**: The number of internal links from the referring page.  \ntype: integer\n\n**lost_reason**: The reason the link was lost during the last crawl.  \ntype: string nullable  \nenum: `\"removedfromhtml\"` `\"notcanonical\"` `\"noindex\"` `\"pageredirected\"` `\"pageerror\"` `\"lostredirect\"` `\"notfound\"`\n\n**name_source**: The complete referring domain name, including subdomains.  \ntype: string\n\n**name_target**: The complete target domain name, including subdomains.  \ntype: string\n\n**noindex**: The referring page has the noindex meta attribute.  \ntype: boolean\n\n**page_size**: The size in bytes of the referring page content.  \ntype: integer\n\n**port_source**: The network port of the referring page URL.  \ntype: integer\n\n**port_target**: The network port of the target page URL.  \ntype: integer\n\n**positions**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer\n\n**positions_source_domain**: The number of keywords that the referring domain ranks for in the top 100 positions.  \ntype: integer\n\n**powered_by**: Web technologies used to build and serve the referring page content.  \ntype: array(string)\n\n**redirect_code**: The HTTP status code of a referring page pointing to your target via a redirect.  \ntype: integer nullable\n\n**redirect_kind**: The HTTP status codes returned by the target redirecting URL or redirect chain.  \ntype: array(integer)\n\n**refdomains_source** (5 units): The number of unique referring domains linking to the referring page.  \ntype: integer\n\n**refdomains_source_domain** (5 units): The number of unique referring domains linking to the referring domain.  \ntype: integer\n\n**refdomains_target_domain** (5 units): The number of unique referring domains linking to the target domain.  \ntype: integer\n\n**root_name_source**: The root domain name of the referring domain, not including subdomains.  \ntype: string\n\n**root_name_target**: The root domain name of the target domain, not including subdomains.  \ntype: string\n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string\n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string\n\n**source_page_author**: The author of the referring page.  \ntype: string nullable\n\n**source_page_publish_date**: the date we identified the page was published  \ntype: date nullable\n\n**title**: The html title of the referring page.  \ntype: string\n\n**tld_class_source**: The top level domain class of the referring domain.  \ntype: string  \nenum: `\"gov\"` `\"edu\"` `\"normal\"`\n\n**tld_class_target**: The top level domain class of the target domain.  \ntype: string  \nenum: `\"gov\"` `\"edu\"` `\"normal\"`\n\n**traffic** (10 units): The referring page's estimated monthly organic traffic from search.  \ntype: integer\n\n**traffic_domain** (10 units): The referring domain's estimated monthly organic traffic from search.  \ntype: integer\n\n**url_from**: The URL of the page containing a link to your target.  \ntype: string\n\n**url_from_plain**: The referring page URL optimized for use as a filter.  \ntype: string\n\n**url_rating_source**: The strength of the referring page's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array(url)\n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array(string)\n\n**url_to**: The URL the backlink points to.  \ntype: string\n\n**url_to_plain**: The target page URL optimized for use as a filter.  \ntype: string",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "aggregation": {
                    "description": "The backlinks grouping mode.",
                    "type": "string",
                    "enum": [
                        "similar_links",
                        "1_per_domain",
                        "all"
                    ]
                },
                "history": {
                    "description": "A time frame to add lost backlinks to the report. Choose between `live` (no history), `since:<date>` (history since a specified date), and `all_time` (full history). The date should be in YYYY-MM-DD format.",
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-all-backlinks"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "aggregation",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/broken-backlinks",
        "_original_request_body": null,
        "description": "Retrieves a list of broken backlinks (i.e., links pointing to non-functioning pages) for a specified domain or URL, with customizable filtering, field selection, and aggregation options. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "aggregation": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**ahrefs_rank_source**: The strength of the referring domain's backlink profile compared to the other websites in our database, with rank #1 being the strongest.  \ntype: integer  \n\n**ahrefs_rank_target**: The strength of the target domain's backlink profile compared to the other websites in our database, with rank #1 being the strongest.  \ntype: integer  \n\n**alt**: The alt attribute of the link.  \ntype: string nullable  \n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string  \n\n**class_c**: (5 units) The number of unique class_c subnets linking to the referring page.  \ntype: integer  \n\n**domain_rating_source**: The strength of the referring domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n**domain_rating_target**: The strength of the referring domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n**encoding**: The character set encoding of the referring page HTML.  \ntype: string  \n\n**first_seen**: The date the referring page URL was first discovered.  \ntype: string<date-time>  \n\n**first_seen_link**: The date we first found a backlink to your target on a given referring page.  \ntype: string<date-time>  \n\n**http_code**: The return code from HTTP protocol returned during the referring page crawl.  \ntype: integer  \n\n**http_code_target**: The return code from HTTP protocol returned during the target page crawl.  \ntype: integer nullable  \n\n**http_crawl**: The link was discovered without executing javascript and rendering the page.  \ntype: boolean  \n\n**ip_source**: The referring domain IP address.  \ntype: string nullable  \n\n**is_alternate**: The link with the rel=“alternate” attribute.  \ntype: boolean  \n\n**is_canonical**: The link with the rel=“canonical” attribute.  \ntype: boolean  \n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean  \n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean  \n\n**is_form**: The link was found in a form HTML tag.  \ntype: boolean  \n\n**is_frame**: The link was found in an iframe HTML tag.  \ntype: boolean  \n\n**is_image**: The link is a regular link that has an image inside their href attribute.  \ntype: boolean  \n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean  \n\n**is_redirect**: The link pointing to your target via a redirect.  \ntype: boolean  \n\n**is_root_source**: The referring domain name is a root domain name.  \ntype: boolean  \n\n**is_root_target**: The target domain name is a root domain name.  \ntype: boolean  \n\n**is_rss**: The link was found in an RSS feed.  \ntype: boolean  \n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean  \n\n**is_text**: The link is a standard href hyperlink.  \ntype: boolean  \n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean  \n\n**js_crawl**: The link was discovered after executing javascript and rendering the page.  \ntype: boolean  \n\n**languages**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array[string]  \n\n**last_seen**: The date we discovered that the link was lost.  \ntype: string<date-time> nullable  \n\n**last_visited**: The date we last re-crawled the referring page to verify the backlink is alive.  \ntype: string<date-time>  \n\n**last_visited_target**: The date we last re-crawled the target page to verify that it is broken.  \ntype: string<date-time> nullable  \n\n**link_group_count**: The number of backlinks that were grouped together based on the aggregation parameter. This field cannot be used with aggregation 'all'.  \ntype: integer  \n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`  \n\n**linked_domains_source_domain**: The number of unique root domains linked from the referring domain.  \ntype: integer  \n\n**linked_domains_source_page**: The number of unique root domains linked from the referring page.  \ntype: integer  \n\n**linked_domains_target_domain**: The number of unique root domains linked from the target domain.  \ntype: integer  \n\n**links_external**: The number of external links from the referring page.  \ntype: integer  \n\n**links_internal**: The number of internal links from the referring page.  \ntype: integer  \n\n**name_source**: The complete referring domain name, including subdomains.  \ntype: string  \n\n**name_target**: The complete target domain name, including subdomains.  \ntype: string  \n\n**page_size**: The size in bytes of the referring page content.  \ntype: integer  \n\n**port_source**: The network port of the referring page URL.  \ntype: integer  \n\n**port_target**: The network port of the target page URL.  \ntype: integer  \n\n**positions**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer  \n\n**powered_by**: Web technologies used to build and serve the referring page content.  \ntype: array[string]  \n\n**redirect_code**: The HTTP status code of a referring page pointing to your target via a redirect.  \ntype: integer nullable  \n\n**redirect_kind**: The HTTP status codes returned by the target redirecting URL or redirect chain.  \ntype: array[integer]  \n\n**refdomains_source**: (5 units) The number of unique referring domains linking to the referring page.  \ntype: integer  \n\n**refdomains_source_domain**: (5 units) The number of unique referring domains linking to the referring domain.  \ntype: integer  \n\n**refdomains_target_domain**: (5 units) The number of unique referring domains linking to the target domain.  \ntype: integer  \n\n**root_name_source**: The root domain name of the referring domain, not including subdomains.  \ntype: string  \n\n**root_name_target**: The root domain name of the target domain, not including subdomains.  \ntype: string  \n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string  \n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string  \n\n**source_page_author**: The author of the referring page.  \ntype: string nullable  \n\n**title**: The html title of the referring page.  \ntype: string  \n\n**tld_class_source**: The top level domain class of the referring domain.  \ntype: string  \nenum: `\"gov\"` `\"edu\"` `\"normal\"`  \n\n**tld_class_target**: The top level domain class of the target domain.  \ntype: string  \nenum: `\"gov\"` `\"edu\"` `\"normal\"`  \n\n**traffic**: (10 units) The referring page's estimated monthly organic traffic from search.  \ntype: integer  \n\n**traffic_domain**: (10 units) The referring domain's estimated monthly organic traffic from search.  \ntype: integer  \n\n**url_from**: The URL of the page containing a link to your target.  \ntype: string<url>  \n\n**url_from_plain**: The referring page URL optimized for use as a filter.  \ntype: string  \n\n**url_rating_source**: The strength of the referring page's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array[string<url>]  \n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array[string]  \n\n**url_to**: The URL the backlink points to.  \ntype: string<url>  \n\n**url_to_plain**: The target page URL optimized for use as a filter.  \ntype: string  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**ahrefs_rank_source**: The strength of the referring domain's backlink profile compared to the other websites in our database, with rank #1 being the strongest.  \ntype: integer\n\n**ahrefs_rank_target**: The strength of the target domain's backlink profile compared to the other websites in our database, with rank #1 being the strongest.  \ntype: integer\n\n**alt**: The alt attribute of the link.  \ntype: string nullable\n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string\n\n**class_c** (5 units): The number of unique class_c subnets linking to the referring page.  \ntype: integer\n\n**domain_rating_source**: The strength of the referring domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**domain_rating_target**: The strength of the referring domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**encoding**: The character set encoding of the referring page HTML.  \ntype: string\n\n**first_seen**: The date the referring page URL was first discovered.  \ntype: datetime\n\n**first_seen_link**: The date we first found a backlink to your target on a given referring page.  \ntype: datetime\n\n**http_code**: The return code from HTTP protocol returned during the referring page crawl.  \ntype: integer\n\n**http_code_target**: The return code from HTTP protocol returned during the target page crawl.  \ntype: integer nullable\n\n**http_crawl**: The link was discovered without executing javascript and rendering the page.  \ntype: boolean\n\n**ip_source**: The referring domain IP address.  \ntype: string nullable\n\n**is_alternate**: The link with the rel=“alternate” attribute.  \ntype: boolean\n\n**is_canonical**: The link with the rel=“canonical” attribute.  \ntype: boolean\n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean\n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean\n\n**is_form**: The link was found in a form HTML tag.  \ntype: boolean\n\n**is_frame**: The link was found in an iframe HTML tag.  \ntype: boolean\n\n**is_homepage_link**: The link was found on the homepage of a referring website.  \ntype: boolean\n\n**is_image**: The link is a regular link that has an image inside their href attribute.  \ntype: boolean\n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean\n\n**is_non_html**: The link points to a URL with non-HTML content.  \ntype: boolean\n\n**is_redirect**: The link pointing to your target via a redirect.  \ntype: boolean\n\n**is_root_source**: The referring domain name is a root domain name.  \ntype: boolean\n\n**is_root_target**: The target domain name is a root domain name.  \ntype: boolean\n\n**is_rss**: The link was found in an RSS feed.  \ntype: boolean\n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean\n\n**is_text**: The link is a standard href hyperlink.  \ntype: boolean\n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean\n\n**js_crawl**: The link was discovered after executing javascript and rendering the page.  \ntype: boolean\n\n**languages**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**last_seen**: The date we discovered that the link was lost.  \ntype: datetime nullable\n\n**last_visited**: The date we last re-crawled the referring page to verify the backlink is alive.  \ntype: datetime\n\n**last_visited_target**: The date we last re-crawled the target page to verify that it is broken.  \ntype: datetime nullable\n\n**len_url_redirect**: The number of redirect chain URLs.  \ntype: integer\n\n**link_group_count**: The number of backlinks that were grouped together based on the aggregation parameter. This field cannot be used with aggregation 'all'.  \ntype: integer\n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`\n\n**linked_domains_source_domain**: The number of unique root domains linked from the referring domain.  \ntype: integer\n\n**linked_domains_source_page**: The number of unique root domains linked from the referring page.  \ntype: integer\n\n**linked_domains_target_domain**: The number of unique root domains linked from the target domain.  \ntype: integer\n\n**links_external**: The number of external links from the referring page.  \ntype: integer\n\n**links_internal**: The number of internal links from the referring page.  \ntype: integer\n\n**name_source**: The complete referring domain name, including subdomains.  \ntype: string\n\n**name_target**: The complete target domain name, including subdomains.  \ntype: string\n\n**page_size**: The size in bytes of the referring page content.  \ntype: integer\n\n**port_source**: The network port of the referring page URL.  \ntype: integer\n\n**port_target**: The network port of the target page URL.  \ntype: integer\n\n**positions**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer\n\n**positions_source_domain**: The number of keywords that the referring domain ranks for in the top 100 positions.  \ntype: integer\n\n**powered_by**: Web technologies used to build and serve the referring page content.  \ntype: array(string)\n\n**redirect_code**: The HTTP status code of a referring page pointing to your target via a redirect.  \ntype: integer nullable\n\n**redirect_kind**: The HTTP status codes returned by the target redirecting URL or redirect chain.  \ntype: array(integer)\n\n**refdomains_source** (5 units): The number of unique referring domains linking to the referring page.  \ntype: integer\n\n**refdomains_source_domain** (5 units): The number of unique referring domains linking to the referring domain.  \ntype: integer\n\n**refdomains_target_domain** (5 units): The number of unique referring domains linking to the target domain.  \ntype: integer\n\n**root_name_source**: The root domain name of the referring domain, not including subdomains.  \ntype: string\n\n**root_name_target**: The root domain name of the target domain, not including subdomains.  \ntype: string\n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string\n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string\n\n**source_page_author**: The author of the referring page.  \ntype: string nullable\n\n**title**: The html title of the referring page.  \ntype: string\n\n**tld_class_source**: The top level domain class of the referring domain.  \ntype: string  \nenum: `\"gov\"` `\"edu\"` `\"normal\"`\n\n**tld_class_target**: The top level domain class of the target domain.  \ntype: string  \nenum: `\"gov\"` `\"edu\"` `\"normal\"`\n\n**traffic** (10 units): The referring page's estimated monthly organic traffic from search.  \ntype: integer\n\n**traffic_domain** (10 units): The referring domain's estimated monthly organic traffic from search.  \ntype: integer\n\n**url_from**: The URL of the page containing a link to your target.  \ntype: string\n\n**url_from_plain**: The referring page URL optimized for use as a filter.  \ntype: string\n\n**url_rating_source**: The strength of the referring page's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array(url)\n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array(string)\n\n**url_to**: The URL the backlink points to.  \ntype: string\n\n**url_to_plain**: The target page URL optimized for use as a filter.  \ntype: string",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "aggregation": {
                    "description": "The backlinks grouping mode.",
                    "type": "string",
                    "enum": [
                        "similar_links",
                        "1_per_domain",
                        "all"
                    ]
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-broken-backlinks"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "history",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/refdomains",
        "_original_request_body": null,
        "description": "Retrieves detailed information about referring domains that link to a specified target domain or URL, with flexible filtering, selection, and sorting of backlink-related metrics. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "history": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**dofollow_linked_domains**: The number of unique root domains with dofollow links linked from the referring domain.  \ntype: integer  \n\n**dofollow_links**: The number of links from the referring domain to your target that don't have the “nofollow” attribute.  \ntype: integer  \n\n**dofollow_refdomains**: (5 units) The number of unique domains with dofollow links to the referring domain.  \ntype: integer  \n\n**domain**: A referring domain that has at least one link to your target.  \ntype: string  \n\n**domain_rating**: The strength of a domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n**first_seen**: The date we first found a backlink to your target from the referring domain.  \ntype: string<date-time>  \n\n**ip_source**: The referring domain IP address.  \ntype: string nullable  \n\n**is_root_domain**: The domain name is a root domain name.  \ntype: boolean  \n\n**last_seen**: The date your target lost its last live backlink for the referring domain.  \ntype: string<date-time> nullable  \n\n**links_to_target**: The number of backlinks from the referring domain to your target.  \ntype: integer  \n\n**lost_links**: The number of backlinks lost from the referring domain for the selected time period.  \ntype: integer  \n\n**new_links**: The number of new backlinks found from the referring domain for the selected time period.  \ntype: integer  \n\n**positions_source_domain**: The number of keywords that the referring domain ranks for in the top 100 positions.  \ntype: integer  \n\n**traffic_domain**: (10 units) The referring domain's estimated monthly organic traffic from search.  \ntype: integer  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string\n\n**discovered_status**: The reason the link was discovered during the last crawl: the page was crawled for the first time, the link was added to the page, or the link re-appeared after being removed.  \ntype: string nullable  \nenum: `\"pagefound\"` `\"linkfound\"` `\"linkrestored\"`\n\n**dofollow_linked_domains**: The number of unique root domains with dofollow links linked from the referring domain.  \ntype: integer\n\n**dofollow_links**: The number of links from the referring domain to your target that don't have the “nofollow” attribute.  \ntype: integer\n\n**dofollow_refdomains** (5 units): The number of unique domains with dofollow links to the referring domain.  \ntype: integer\n\n**domain**: A referring domain that has at least one link to your target.  \ntype: string\n\n**domain_rating**: The strength of a domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**drop_reason**: The reason we removed the link from our index.  \ntype: string nullable  \nenum: `\"manual\"` `\"noratingunused\"` `\"notop\"` `\"tooold\"` `\"oldunavailable\"` `\"rescursive\"` `\"duplicate\"` `\"nxdomain\"` `\"malformed\"` `\"blockedport\"` `\"disallowed\"` `\"unlinked\"`\n\n**first_seen**: The date we first found a backlink to your target from the referring domain.  \ntype: datetime\n\n**ip_source**: The referring domain IP address.  \ntype: string nullable\n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean\n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean\n\n**is_homepage_link**: The link was found on the homepage of a referring website.  \ntype: boolean\n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean\n\n**is_non_html**: The link points to a URL with non-HTML content.  \ntype: boolean\n\n**is_root_domain**: The domain name is a root domain name.  \ntype: boolean\n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean\n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean\n\n**languages**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**last_seen**: The date your target lost its last live backlink for the referring domain.  \ntype: datetime nullable\n\n**len_url_redirect**: The number of redirect chain URLs.  \ntype: integer\n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`\n\n**linked_domains**: The number of unique root domains linked from the referring page.  \ntype: integer\n\n**links_external**: The number of external links from the referring page.  \ntype: integer\n\n**links_to_target**: The number of backlinks from the referring domain to your target.  \ntype: integer\n\n**lost_links**: The number of backlinks lost from the referring domain for the selected time period.  \ntype: integer\n\n**lost_reason**: The reason the link was lost during the last crawl.  \ntype: string nullable  \nenum: `\"removedfromhtml\"` `\"notcanonical\"` `\"noindex\"` `\"pageredirected\"` `\"pageerror\"` `\"lostredirect\"` `\"notfound\"`\n\n**new_links**: The number of new backlinks found from the referring domain for the selected time period.  \ntype: integer\n\n**noindex**: The referring page has the noindex meta attribute.  \ntype: boolean\n\n**port_source**: The network port of the referring page URL.  \ntype: integer\n\n**port_target**: The network port of the target page URL.  \ntype: integer\n\n**positions**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer\n\n**positions_source_domain**: The number of keywords that the referring domain ranks for in the top 100 positions.  \ntype: integer\n\n**powered_by**: Web technologies used to build and serve the referring page content.  \ntype: array(string)\n\n**refdomains** (5 units): The number of unique referring domains linking to the referring page.  \ntype: integer\n\n**root_domain_name**: The root domain name of the referring domain, not including subdomains.  \ntype: string\n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string\n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string\n\n**source_page_author**: The author of the referring page.  \ntype: string nullable\n\n**title**: The html title of the referring page.  \ntype: string\n\n**traffic_domain** (10 units): The referring domain's estimated monthly organic traffic from search.  \ntype: integer\n\n**traffic_page** (10 units): The referring page's estimated monthly organic traffic from search.  \ntype: integer\n\n**url_from**: The URL of the page containing a link to your target.  \ntype: string\n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array(url)\n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array(string)\n\n**url_to**: The URL the backlink points to.  \ntype: string",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "history": {
                    "description": "A time frame to add lost backlinks to the report. Choose between `live` (no history), `since:<date>` (history since a specified date), and `all_time` (full history). The date should be in YYYY-MM-DD format.",
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-refdomains"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "history",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/anchors",
        "_original_request_body": null,
        "description": "Retrieves anchor text and associated backlink metrics for a specified domain or URL, with filtering and selection options. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "history": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**anchor**: The clickable words in a link that point to a URL.  \ntype: string  \n\n**dofollow_links**: The number of links with a given anchor to your target that don’t have the “nofollow” attribute.  \ntype: integer  \n\n**first_seen**: The date we first found a link with a given anchor to your target.  \ntype: string<date-time>  \n\n**last_seen**: The date we discovered the last backlink with a given anchor was lost.  \ntype: string<date-time> nullable  \n\n**links_to_target**: The number of inbound backlinks your target has with a given anchor.  \ntype: integer  \n\n**lost_links**: The number of backlinks with a given anchor lost during the selected time period.  \ntype: integer  \n\n**new_links**: The number of new backlinks with a given anchor found during the selected time period.  \ntype: integer  \n\n**refdomains**: (5 units) The number of unique domains linking to your target with a given anchor.  \ntype: integer  \n\n**refpages**: The number of pages containing a link with a given anchor to your target.  \ntype: integer  \n\n**top_domain_rating**: The highest Domain Rating (DR) counted out of all referring domains. DR shows the strength of a website’s backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string\n\n**discovered_status**: The reason the link was discovered during the last crawl: the page was crawled for the first time, the link was added to the page, or the link re-appeared after being removed.  \ntype: string nullable  \nenum: `\"pagefound\"` `\"linkfound\"` `\"linkrestored\"`\n\n**dofollow_links**: The number of links with a given anchor to your target that don’t have the “nofollow” attribute.  \ntype: integer\n\n**domain_rating**: The strength of a domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**drop_reason**: The reason we removed the link from our index.  \ntype: string nullable  \nenum: `\"manual\"` `\"noratingunused\"` `\"notop\"` `\"tooold\"` `\"oldunavailable\"` `\"rescursive\"` `\"duplicate\"` `\"nxdomain\"` `\"malformed\"` `\"blockedport\"` `\"disallowed\"` `\"unlinked\"`\n\n**first_seen**: The date we first found a link with a given anchor to your target.  \ntype: datetime\n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean\n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean\n\n**is_homepage_link**: The link was found on the homepage of a referring website.  \ntype: boolean\n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean\n\n**is_non_html**: The link points to a URL with non-HTML content.  \ntype: boolean\n\n**is_root_domain**: The domain name is a root domain name.  \ntype: boolean\n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean\n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean\n\n**languages**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**last_seen**: The date we discovered the last backlink with a given anchor was lost.  \ntype: datetime nullable\n\n**len_url_redirect**: The number of redirect chain URLs.  \ntype: integer\n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`\n\n**linked_domains**: The number of unique root domains linked from the referring page.  \ntype: integer\n\n**links_external**: The number of external links from the referring page.  \ntype: integer\n\n**links_to_target**: The number of inbound backlinks your target has with a given anchor.  \ntype: integer\n\n**lost_links**: The number of backlinks with a given anchor lost during the selected time period.  \ntype: integer\n\n**lost_reason**: The reason the link was lost during the last crawl.  \ntype: string nullable  \nenum: `\"removedfromhtml\"` `\"notcanonical\"` `\"noindex\"` `\"pageredirected\"` `\"pageerror\"` `\"lostredirect\"` `\"notfound\"`\n\n**new_links**: The number of new backlinks with a given anchor found during the selected time period.  \ntype: integer\n\n**noindex**: The referring page has the noindex meta attribute.  \ntype: boolean\n\n**positions**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer\n\n**positions_source_domain**: The number of keywords that the referring domain ranks for in the top 100 positions.  \ntype: integer\n\n**powered_by**: Web technologies used to build and serve the referring page content.  \ntype: array(string)\n\n**refdomains** (5 units): The number of unique domains linking to your target with a given anchor.  \ntype: integer\n\n**refdomains_source** (5 units): The number of unique referring domains linking to the referring page.  \ntype: integer\n\n**refpages**: The number of pages containing a link with a given anchor to your target.  \ntype: integer\n\n**root_domain_name**: The root domain name of the referring domain, not including subdomains.  \ntype: string\n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string\n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string\n\n**source_page_author**: The author of the referring page.  \ntype: string nullable\n\n**title**: The html title of the referring page.  \ntype: string\n\n**top_domain_rating**: The highest Domain Rating (DR) counted out of all referring domains. DR shows the strength of a website’s backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**traffic_domain** (10 units): The referring domain's estimated monthly organic traffic from search.  \ntype: integer\n\n**traffic_page** (10 units): The referring page's estimated monthly organic traffic from search.  \ntype: integer\n\n**url_from**: The URL of the page containing a link to your target.  \ntype: string\n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array(url)\n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array(string)\n\n**url_to**: The URL the backlink points to.  \ntype: string",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "history": {
                    "description": "A time frame to add lost backlinks to the report. Choose between `live` (no history), `since:<date>` (history since a specified date), and `all_time` (full history). The date should be in YYYY-MM-DD format.",
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-anchors"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/linkeddomains",
        "_original_request_body": null,
        "description": "Retrieves information about external domains that are linked from a specified target domain or URL, allowing for filtering, field selection, and various scopes of analysis. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**dofollow_linked_domains**: The number of unique root domains with dofollow links linked from the linked domain.  \ntype: integer  \n\n**dofollow_links**: The number of links from your target to the linked domain that don’t have the “nofollow” attribute.  \ntype: integer  \n\n**dofollow_refdomains**: (5 units) The number of unique domains with dofollow links to the linked domain.  \ntype: integer  \n\n**domain**: A linked domain that has at least one link from your target.  \ntype: string  \n\n**domain_rating**: The strength of a domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n**first_seen**: The date we first found a link to the linked domain from your target.  \ntype: string<date-time>  \n\n**is_root_domain**: The domain name is a root domain name.  \ntype: boolean  \n\n**linked_domain_traffic**: (10 units) The linked domain’s estimated monthly organic traffic from search  \ntype: integer  \n\n**linked_pages**: The number of the domain's pages linked from your target.  \ntype: integer  \n\n**links_from_target**: The number of links to the linked domain from your target.  \ntype: integer  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string\n\n**dofollow_linked_domains**: The number of unique root domains with dofollow links linked from the linked domain.  \ntype: integer\n\n**dofollow_links**: The number of links from your target to the linked domain that don’t have the “nofollow” attribute.  \ntype: integer\n\n**dofollow_refdomains** (5 units): The number of unique domains with dofollow links to the linked domain.  \ntype: integer\n\n**domain**: A linked domain that has at least one link from your target.  \ntype: string\n\n**domain_rating**: The strength of a domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**first_seen**: The date we first found a link to the linked domain from your target.  \ntype: datetime\n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean\n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean\n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean\n\n**is_non_html**: The link points to a URL with non-HTML content.  \ntype: boolean\n\n**is_root_domain**: The domain name is a root domain name.  \ntype: boolean\n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean\n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean\n\n**languages**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**len_url_redirect**: The number of redirect chain URLs.  \ntype: integer\n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`\n\n**linked_domain_traffic** (10 units): The linked domain’s estimated monthly organic traffic from search  \ntype: integer\n\n**linked_domains**: The number of unique root domains linked from the referring page.  \ntype: integer\n\n**linked_pages**: The number of the domain's pages linked from your target.  \ntype: integer\n\n**links_external**: The number of external links from the referring page.  \ntype: integer\n\n**links_from_target**: The number of links to the linked domain from your target.  \ntype: integer\n\n**port_source**: The network port of the referring page URL.  \ntype: integer\n\n**port_target**: The network port of the target page URL.  \ntype: integer\n\n**positions**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer\n\n**powered_by**: Web technologies used to build and serve the referring page content.  \ntype: array(string)\n\n**refdomains** (5 units): The number of unique referring domains linking to the referring page.  \ntype: integer\n\n**root_domain_name**: The root domain name of the referring domain, not including subdomains.  \ntype: string\n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string\n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string\n\n**title**: The html title of the referring page.  \ntype: string\n\n**traffic_page** (10 units): The referring page's estimated monthly organic traffic from search.  \ntype: integer\n\n**url_from**: The URL of the page containing a link from your target.  \ntype: string\n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array(url)\n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array(string)\n\n**url_to**: The URL the outgoing link points to.  \ntype: string",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-linkeddomains"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/linked-anchors-external",
        "_original_request_body": null,
        "description": "Retrieves data about external anchor text (the clickable words in outbound links) used on a specified domain, subdomain, or URL, including metrics like dofollow link counts, distinct linked domains, and other attributes about the links. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**anchor**: The clickable words in a link that point to a URL.  \ntype: string  \n\n**dofollow_links**: The number of outbound links with a given anchor from your target that don’t have the “nofollow” attribute.  \ntype: integer  \n\n**first_seen**: The date we first found a link with a given anchor on your target.  \ntype: string<date-time>  \n\n**linked_domains**: The number of unique domains linked from your target with a given anchor.  \ntype: integer  \n\n**linked_pages**: The number of unique pages linked from your target with a given anchor.  \ntype: integer  \n\n**links_from_target**: The number of outbound links your target has with a given anchor.  \ntype: integer  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string\n\n**dofollow_links**: The number of outbound links with a given anchor from your target that don’t have the “nofollow” attribute.  \ntype: integer\n\n**domain**: A linked domain that has at least one link from your target with a given anchor.  \ntype: string\n\n**domain_rating**: The strength of a domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**first_seen**: The date we first found a link with a given anchor on your target.  \ntype: datetime\n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean\n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean\n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean\n\n**is_non_html**: The link points to a URL with non-HTML content.  \ntype: boolean\n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean\n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean\n\n**languages**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**len_url_redirect**: The number of redirect chain URLs.  \ntype: integer\n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`\n\n**linked_domains**: The number of unique domains linked from your target with a given anchor.  \ntype: integer\n\n**linked_domains_source**: The number of unique root domains linked from the source page.  \ntype: integer\n\n**linked_pages**: The number of unique pages linked from your target with a given anchor.  \ntype: integer\n\n**links_external**: The number of external links from the referring page.  \ntype: integer\n\n**links_from_target**: The number of outbound links your target has with a given anchor.  \ntype: integer\n\n**port_source**: The network port of the referring page URL.  \ntype: integer\n\n**port_target**: The network port of the target page URL.  \ntype: integer\n\n**positions**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer\n\n**powered_by**: Web technologies used to build and serve the referring page content.  \ntype: array(string)\n\n**refdomains_source** (5 units): The number of unique referring domains linking to the referring page.  \ntype: integer\n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string\n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string\n\n**title**: The html title of the referring page.  \ntype: string\n\n**traffic_page** (10 units): The referring page's estimated monthly organic traffic from search.  \ntype: integer\n\n**url_from**: The URL of the page containing a link to your target.  \ntype: string\n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array(url)\n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array(string)\n\n**url_to**: The URL the backlink points to.  \ntype: string",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-linked-anchors-external"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/linked-anchors-internal",
        "_original_request_body": null,
        "description": "Retrieves internal anchor text data for a given website or URL, detailing how anchor texts are used in links between pages on the same site. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**anchor**: The clickable words in a link that point to a URL.  \ntype: string  \n\n**dofollow_links**: The number of outbound links with a given anchor from your target that don’t have the “nofollow” attribute.  \ntype: integer  \n\n**first_seen**: The date we first found a link with a given anchor on your target.  \ntype: string<date-time>  \n\n**linked_pages**: The number of unique pages linked from your target with a given anchor.  \ntype: integer  \n\n**links_from_target**: The number of outbound links your target has with a given anchor.  \ntype: integer  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string\n\n**dofollow_links**: The number of outbound links with a given anchor from your target that don’t have the “nofollow” attribute.  \ntype: integer\n\n**domain**: A linked domain that has at least one link from your target with a given anchor.  \ntype: string\n\n**domain_rating**: The strength of a domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**first_seen**: The date we first found a link with a given anchor on your target.  \ntype: datetime\n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean\n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean\n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean\n\n**is_non_html**: The link points to a URL with non-HTML content.  \ntype: boolean\n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean\n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean\n\n**languages**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**len_url_redirect**: The number of redirect chain URLs.  \ntype: integer\n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`\n\n**linked_domains_source**: The number of unique root domains linked from the source page.  \ntype: integer\n\n**linked_pages**: The number of unique pages linked from your target with a given anchor.  \ntype: integer\n\n**links_external**: The number of external links from the referring page.  \ntype: integer\n\n**links_from_target**: The number of outbound links your target has with a given anchor.  \ntype: integer\n\n**port_source**: The network port of the referring page URL.  \ntype: integer\n\n**port_target**: The network port of the target page URL.  \ntype: integer\n\n**positions**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer\n\n**powered_by**: Web technologies used to build and serve the referring page content.  \ntype: array(string)\n\n**refdomains_source** (5 units): The number of unique referring domains linking to the referring page.  \ntype: integer\n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string\n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string\n\n**title**: The html title of the referring page.  \ntype: string\n\n**traffic_page** (10 units): The referring page's estimated monthly organic traffic from search.  \ntype: integer\n\n**url_from**: The URL of the page containing a link to your target.  \ntype: string\n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array(url)\n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array(string)\n\n**url_to**: The URL the backlink points to.  \ntype: string",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-linked-anchors-internal"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "country",
                "required": false
            },
            {
                "in": "query",
                "name": "date_compared",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/organic-keywords",
        "_original_request_body": null,
        "description": "Retrieves detailed organic keyword data for a given domain, URL, or path, including rankings, search intent, SERP features, traffic and CPC metrics, with the ability to filter, sort, and compare metrics across dates and regions. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "date_compared": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                },
                "volume_mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target",
                "date"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**best_position**: The top position your target ranks for in the organic search results for a keyword.  \ntype: integer nullable  \n\n**best_position_diff**: The change in position between your selected dates.  \ntype: integer nullable  \n\n**best_position_has_thumbnail**: The top position has a thumbnail.  \ntype: boolean nullable  \n\n**best_position_has_thumbnail_prev**: The top position has a thumbnail on the comparison date.  \ntype: boolean nullable  \n\n**best_position_has_video**: The top position has a video.  \ntype: boolean nullable  \n\n**best_position_has_video_prev**: The top position has a video on the comparison date.  \ntype: boolean nullable  \n\n**best_position_kind**: The kind of the top position: organic, paid, or a SERP feature.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`  \n\n**best_position_kind_merged**: The kind of the top position optimized for sorting.  \ntype: string  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`  \n\n**best_position_kind_prev**: The kind of the top position on the comparison date.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`  \n\n**best_position_prev**: The top position on the comparison date.  \ntype: integer nullable  \n\n**best_position_set**: The ranking group of the top position.  \ntype: string  \nenum: `\"top_3\"` `\"top_4_10\"` `\"top_11_50\"` `\"top_51_more\"`  \n\n**best_position_set_prev**: The ranking group of the top position on the comparison date.  \ntype: string nullable  \nenum: `\"top_3\"` `\"top_4_10\"` `\"top_11_50\"` `\"top_51_more\"`  \n\n**best_position_url**: The ranking URL in organic search results.  \ntype: string<url> nullable  \n\n**best_position_url_prev**: The ranking URL on the comparison date.  \ntype: string<url> nullable  \n\n**cpc**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents.  \ntype: integer nullable  \n\n**cpc_merged**: The CPC field optimized for sorting.  \ntype: integer nullable  \n\n**cpc_prev**: The CPC metric on the comparison date.  \ntype: integer nullable  \n\n**is_best_position_set_top_11_50**: The ranking group of the top position is 11-50.  \ntype: boolean  \n\n**is_best_position_set_top_11_50_prev**: The ranking group of the top position was 11-50 on the comparison date.  \ntype: boolean nullable  \n\n**is_best_position_set_top_3**: The ranking group of the top position is Top 3.  \ntype: boolean  \n\n**is_best_position_set_top_3_prev**: The ranking group of the top position was Top 3 on the comparison date.  \ntype: boolean nullable  \n\n**is_best_position_set_top_4_10**: The ranking group of the top position is 4-10.  \ntype: boolean  \n\n**is_best_position_set_top_4_10_prev**: The ranking group of the top position was 4-10 on the comparison date.  \ntype: boolean nullable  \n\n**is_branded**: User intent: branded. The user is searching for a specific brand or company name.  \ntype: boolean  \n\n**is_commercial**: User intent: commercial. The user is comparing products or services before making a purchase decision.  \ntype: boolean  \n\n**is_informational**: User intent: informational. The user is looking for information or an answer to a specific question.  \ntype: boolean  \n\n**is_local**: User intent: local. The user is looking for information relevant to a specific location or nearby services.  \ntype: boolean  \n\n**is_navigational**: User intent: navigational. The user is searching for a specific website or web page.  \ntype: boolean  \n\n**is_transactional**: User intent: transactional. The user is ready to complete an action, often a purchase.  \ntype: boolean  \n\n**keyword**: The keyword your target ranks for.  \ntype: string nullable  \n\n**keyword_country**: The country of a keyword your target ranks for.  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`  \n\n**keyword_difficulty**: (10 units) An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable  \n\n**keyword_difficulty_merged**: (10 units) The keyword difficulty field optimized for sorting.  \ntype: integer nullable  \n\n**keyword_difficulty_prev**: (10 units) The keyword difficulty on the comparison date.  \ntype: integer nullable  \n\n**keyword_merged**: The keyword field optimized for sorting.  \ntype: string  \n\n**keyword_prev**: The keyword your target ranks for on the comparison date.  \ntype: string nullable  \n\n**language**: The SERP language.  \ntype: string  \n\n**language_prev**: The SERP language on the comparison date.  \ntype: string nullable  \n\n**last_update**: The date when we last checked search engine results for a keyword.  \ntype: string<date-time>  \n\n**last_update_prev**: The date when we checked search engine results up to the comparison date.  \ntype: string<date-time> nullable  \n\n**serp_features**: The SERP features that appear in search results for a keyword.  \ntype: array[string]  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`  \n\n**serp_features_count**: The number of SERP features that appear in search results for a keyword.  \ntype: integer  \n\n**serp_features_count_prev**: The number of SERP features on the comparison date.  \ntype: integer nullable  \n\n**serp_features_merged**: The SERP features field optimized for sorting.  \ntype: array[string]  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`  \n\n**serp_features_prev**: The SERP features on the comparison date.  \ntype: array[string]  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`  \n\n**serp_target_main_positions_count**: The number of target URLs ranking for a keyword excluding positions in Sitelinks, Top stories, Image packs, and posts on X (Twitter).  \ntype: integer  \n\n**serp_target_main_positions_count_prev**: The number of target URLs ranking for a keyword excluding positions in Sitelinks, Top stories, Image packs, and posts on X (Twitter) on the comparison date.  \ntype: integer nullable  \n\n**serp_target_positions_count**: The number of target URLs ranking for a keyword.  \ntype: integer  \n\n**serp_target_positions_count_prev**: The number of target URLs ranking for a keyword on the comparison date.  \ntype: integer nullable  \n\n**status**: The status of a page: the new page that just started to rank (\"left\"), the lost page that disappeared from search results (\"right\"), or no change (\"both\").  \ntype: string  \nenum: `\"left\"` `\"right\"` `\"both\"`  \n\n**sum_paid_traffic**: (10 units) An estimation of the number of monthly visits that your target gets from paid search for a keyword.  \ntype: integer nullable  \n\n**sum_paid_traffic_merged**: (10 units) The paid traffic field optimized for sorting.  \ntype: integer  \n\n**sum_paid_traffic_prev**: (10 units) The paid traffic on the comparison date.  \ntype: integer nullable  \n\n**sum_traffic**: (10 units) An estimation of the number of monthly visitors that your target gets from organic search for a keyword.  \ntype: integer nullable  \n\n**sum_traffic_merged**: (10 units) The traffic field optimized for sorting.  \ntype: integer  \n\n**sum_traffic_prev**: (10 units) The traffic on the comparison date.  \ntype: integer nullable  \n\n**volume**: (10 units) An estimation of the number of searches for a keyword over the latest month.  \ntype: integer nullable  \n\n**volume_desktop_pct**: The percentage of the total search volume that comes from desktop devices.  \ntype: number<float> nullable  \n\n**volume_merged**: (10 units) The search volume field optimized for sorting.  \ntype: integer nullable  \n\n**volume_mobile_pct**: The percentage of the total search volume that comes from mobile devices.  \ntype: number<float> nullable  \n\n**volume_prev**: (10 units) The search volume on the comparison date.  \ntype: integer nullable  \n\n**words**: The number of words in a keyword.  \ntype: integer nullable  \n\n**words_merged**: The number of words in a keyword optimized for sorting.  \ntype: integer  \n\n**words_prev**: The number of words in a keyword on the comparison date.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**best_position**: The top position your target ranks for in the organic search results for a keyword.  \ntype: integer nullable\n\n**best_position_diff**: The change in position between your selected dates.  \ntype: integer nullable\n\n**best_position_has_thumbnail**: The top position has a thumbnail.  \ntype: boolean nullable\n\n**best_position_has_thumbnail_prev**: The top position has a thumbnail on the comparison date.  \ntype: boolean nullable\n\n**best_position_has_video**: The top position has a video.  \ntype: boolean nullable\n\n**best_position_has_video_prev**: The top position has a video on the comparison date.  \ntype: boolean nullable\n\n**best_position_kind**: The kind of the top position: organic, paid, or a SERP feature.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**best_position_kind_merged**: The kind of the top position optimized for sorting.  \ntype: string  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**best_position_kind_prev**: The kind of the top position on the comparison date.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**best_position_prev**: The top position on the comparison date.  \ntype: integer nullable\n\n**best_position_set**: The ranking group of the top position.  \ntype: string  \nenum: `\"top_3\"` `\"top_4_10\"` `\"top_11_50\"` `\"top_51_more\"`\n\n**best_position_set_prev**: The ranking group of the top position on the comparison date.  \ntype: string nullable  \nenum: `\"top_3\"` `\"top_4_10\"` `\"top_11_50\"` `\"top_51_more\"`\n\n**best_position_url**: The ranking URL in organic search results.  \ntype: string nullable\n\n**best_position_url_prev**: The ranking URL on the comparison date.  \ntype: string nullable\n\n**best_position_url_raw**: The ranking page URL in encoded format.  \ntype: string nullable\n\n**best_position_url_raw_prev**: The ranking page URL on the comparison date in encoded format.  \ntype: string nullable\n\n**cpc**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents.  \ntype: integer nullable\n\n**cpc_merged**: The CPC field optimized for sorting.  \ntype: integer nullable\n\n**cpc_prev**: The CPC metric on the comparison date.  \ntype: integer nullable\n\n**is_best_position_set_top_11_50**: The ranking group of the top position is 11-50.  \ntype: boolean\n\n**is_best_position_set_top_11_50_prev**: The ranking group of the top position was 11-50 on the comparison date.  \ntype: boolean nullable\n\n**is_best_position_set_top_3**: The ranking group of the top position is Top 3.  \ntype: boolean\n\n**is_best_position_set_top_3_prev**: The ranking group of the top position was Top 3 on the comparison date.  \ntype: boolean nullable\n\n**is_best_position_set_top_4_10**: The ranking group of the top position is 4-10.  \ntype: boolean\n\n**is_best_position_set_top_4_10_prev**: The ranking group of the top position was 4-10 on the comparison date.  \ntype: boolean nullable\n\n**is_branded**: User intent: branded. The user is searching for a specific brand or company name.  \ntype: boolean\n\n**is_commercial**: User intent: commercial. The user is comparing products or services before making a purchase decision.  \ntype: boolean\n\n**is_informational**: User intent: informational. The user is looking for information or an answer to a specific question.  \ntype: boolean\n\n**is_local**: User intent: local. The user is looking for information relevant to a specific location or nearby services.  \ntype: boolean\n\n**is_main_position**: Excludes positions in Sitelinks, Top stories, Image packs, and posts on X (Twitter).  \ntype: boolean\n\n**is_main_position_prev**: Excludes positions in Sitelinks, Top stories, Image packs, and posts on X (Twitter) on the comparison date.  \ntype: boolean\n\n**is_navigational**: User intent: navigational. The user is searching for a specific website or web page.  \ntype: boolean\n\n**is_transactional**: User intent: transactional. The user is ready to complete an action, often a purchase.  \ntype: boolean\n\n**keyword**: The keyword your target ranks for.  \ntype: string\n\n**keyword_country**: The country of a keyword your target ranks for.  \ntype: string  \nenum: `\"AD\"` .. `\"ZW\"`\n\n**keyword_difficulty** (10 units): An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable\n\n**keyword_difficulty_merged** (10 units): The keyword difficulty field optimized for sorting.  \ntype: integer nullable\n\n**keyword_difficulty_prev** (10 units): The keyword difficulty on the comparison date.  \ntype: integer nullable\n\n**keyword_merged**: The keyword field optimized for sorting.  \ntype: string\n\n**keyword_prev**: The keyword your target ranks for on the comparison date.  \ntype: string\n\n**language**: The SERP language.  \ntype: string\n\n**language_prev**: The SERP language on the comparison date.  \ntype: string nullable\n\n**last_update**: The date when we last checked search engine results for a keyword.  \ntype: datetime\n\n**last_update_prev**: The date when we checked search engine results up to the comparison date.  \ntype: datetime nullable\n\n**position_kind**: The kind of a position: organic, paid or a SERP feature. This applies to all positions for a given keyword and URL before picking the top position.  \ntype: string  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**position_kind_prev**: The kind of a position on the comparison date.  \ntype: string  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**positions_kinds**: The kinds of the top positions.  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**positions_kinds_prev**: The kinds of the top positions on the comparison date.  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**serp_features**: The SERP features that appear in search results for a keyword.  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**serp_features_count**: The number of SERP features that appear in search results for a keyword.  \ntype: integer\n\n**serp_features_count_prev**: The number of SERP features on the comparison date.  \ntype: integer nullable\n\n**serp_features_merged**: The SERP features field optimized for sorting.  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**serp_features_prev**: The SERP features on the comparison date.  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**serp_target_main_positions_count**: The number of target URLs ranking for a keyword excluding positions in Sitelinks, Top stories, Image packs, and posts on X (Twitter).  \ntype: integer\n\n**serp_target_main_positions_count_prev**: The number of target URLs ranking for a keyword excluding positions in Sitelinks, Top stories, Image packs, and posts on X (Twitter) on the comparison date.  \ntype: integer nullable\n\n**serp_target_positions_count**: The number of target URLs ranking for a keyword.  \ntype: integer\n\n**serp_target_positions_count_prev**: The number of target URLs ranking for a keyword on the comparison date.  \ntype: integer nullable\n\n**status**: The status of a page: the new page that just started to rank (\"left\"), the lost page that disappeared from search results (\"right\"), or no change (\"both\").  \ntype: string  \nenum: `\"left\"` `\"right\"` `\"both\"`\n\n**sum_paid_traffic** (10 units): An estimation of the number of monthly visits that your target gets from paid search for a keyword.  \ntype: integer nullable\n\n**sum_paid_traffic_merged** (10 units): The paid traffic field optimized for sorting.  \ntype: integer\n\n**sum_paid_traffic_prev** (10 units): The paid traffic on the comparison date.  \ntype: integer nullable\n\n**sum_traffic** (10 units): An estimation of the number of monthly visitors that your target gets from organic search for a keyword.  \ntype: integer nullable\n\n**sum_traffic_merged** (10 units): The traffic field optimized for sorting.  \ntype: integer\n\n**sum_traffic_prev** (10 units): The traffic on the comparison date.  \ntype: integer nullable\n\n**title**: The title displayed for the page in a keyword's SERP.  \ntype: string\n\n**title_prev**: The title displayed for the page in a keyword's SERP on the comparison date.  \ntype: string\n\n**volume** (10 units): An estimation of the number of searches for a keyword over the latest month.  \ntype: integer nullable\n\n**volume_desktop_pct**: The percentage of the total search volume that comes from desktop devices.  \ntype: float nullable\n\n**volume_merged** (10 units): The search volume field optimized for sorting.  \ntype: integer nullable\n\n**volume_mobile_pct**: The percentage of the total search volume that comes from mobile devices.  \ntype: float nullable\n\n**volume_prev** (10 units): The search volume on the comparison date.  \ntype: integer nullable\n\n**words**: The number of words in a keyword.  \ntype: integer\n\n**words_merged**: The number of words in a keyword optimized for sorting.  \ntype: integer\n\n**words_prev**: The number of words in a keyword on the comparison date.  \ntype: integer",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "date_compared": {
                    "description": "A date to compare metrics with in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                }
            },
            "required": [
                "select",
                "target",
                "date"
            ],
            "type": "object"
        },
        "name": "site-explorer-organic-keywords"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "country",
                "required": true
            },
            {
                "in": "query",
                "name": "date_compared",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/organic-competitors",
        "_original_request_body": null,
        "description": "Retrieves a list of organic search competitors for a specified website or URL, providing comparative SEO metrics such as common keywords, traffic estimations, and domain strength for a chosen country and date. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "date_compared": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                },
                "volume_mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target",
                "country",
                "date"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**competitor_domain**: A competitor's domain of your target in “domains\" group mode.  \ntype: string<domain> nullable  \n\n**competitor_url**: A competitor's URL of your target in pages\" group mode.  \ntype: string<url> nullable  \n\n**domain_rating**: The strength of a domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n**group_mode**: To see competing pages instead, use the “exact URL” target mode or “path” target mode if your target doesn't have multiple pages.  \ntype: string  \nenum: `\"domains\"` `\"pages\"`  \n\n**keywords_common**: Organic keywords that both your target and a competitor are ranking for.  \ntype: integer  \n\n**keywords_competitor**: Organic keywords that a competitor is ranking for, but your target isn't.  \ntype: integer  \n\n**keywords_target**: Organic keywords that your target is ranking for, but a competitor isn't.  \ntype: integer  \n\n**pages**: The total number of pages from a target ranking in search results.  \ntype: integer nullable  \n\n**pages_diff**: The change in pages between your selected dates.  \ntype: integer  \n\n**pages_merged**: The pages field optimized for sorting.  \ntype: integer  \n\n**pages_prev**: The total number of pages from a target ranking in search results on the comparison date.  \ntype: integer nullable  \n\n**share**: The percentage of common keywords out of the total number of keywords that your target and a competitor both rank for.  \ntype: number<float>  \n\n**traffic**: (10 units) An estimation of the number of monthly visits that a page gets from organic search over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable  \n\n**traffic_diff**: The change in traffic between your selected dates.  \ntype: integer  \n\n**traffic_merged**: (10 units) The traffic field optimized for sorting.  \ntype: integer  \n\n**traffic_prev**: (10 units) An estimation of the number of monthly visits that a page gets from organic search over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter on the comparison date.  \ntype: integer nullable  \n\n**value**: (10 units) The estimated value of a page's monthly organic search traffic, in USD cents.  \ntype: integer nullable  \n\n**value_diff**: The change in value between your selected dates.  \ntype: integer  \n\n**value_merged**: (10 units) The value field optimized for sorting.  \ntype: integer nullable  \n\n**value_prev**: (10 units) The estimated value of a page's monthly organic search traffic, in USD cents on the comparison date.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**competitor_domain**: A competitor's domain of your target in “domains\" group mode.  \ntype: domain nullable\n\n**competitor_url**: A competitor's URL of your target in pages\" group mode.  \ntype: url nullable\n\n**cpc_competitor**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents for a competitor.  \ntype: integer nullable\n\n**cpc_target**: Cost Per Click shows the average price that advertisers pay for each ad click in paid search results for a keyword, in USD cents for a target.  \ntype: integer nullable\n\n**domain_rating**: The strength of a domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**group_mode**: To see competing pages instead, use the “exact URL” target mode or “path” target mode if your target doesn't have multiple pages.  \ntype: string  \nenum: `\"domains\"` `\"pages\"`\n\n**keyword_difficulty_competitor** (10 units): An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale for a competitor.  \ntype: integer nullable\n\n**keyword_difficulty_target** (10 units): An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale for a target.  \ntype: integer nullable\n\n**keywords_common**: Organic keywords that both your target and a competitor are ranking for.  \ntype: integer\n\n**keywords_competitor**: Organic keywords that a competitor is ranking for, but your target isn't.  \ntype: integer\n\n**keywords_target**: Organic keywords that your target is ranking for, but a competitor isn't.  \ntype: integer\n\n**pages**: The total number of pages from a target ranking in search results.  \ntype: integer nullable\n\n**pages_diff**: The change in pages between your selected dates.  \ntype: integer\n\n**pages_merged**: The pages field optimized for sorting.  \ntype: integer\n\n**pages_prev**: The total number of pages from a target ranking in search results on the comparison date.  \ntype: integer nullable\n\n**share**: The percentage of common keywords out of the total number of keywords that your target and a competitor both rank for.  \ntype: float\n\n**traffic** (10 units): An estimation of the number of monthly visits that a page gets from organic search over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable\n\n**traffic_diff**: The change in traffic between your selected dates.  \ntype: integer\n\n**traffic_merged** (10 units): The traffic field optimized for sorting.  \ntype: integer\n\n**traffic_prev** (10 units): An estimation of the number of monthly visits that a page gets from organic search over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter on the comparison date.  \ntype: integer nullable\n\n**value** (10 units): The estimated value of a page's monthly organic search traffic, in USD cents.  \ntype: integer nullable\n\n**value_diff**: The change in value between your selected dates.  \ntype: integer\n\n**value_merged** (10 units): The value field optimized for sorting.  \ntype: integer nullable\n\n**value_prev** (10 units): The estimated value of a page's monthly organic search traffic, in USD cents on the comparison date.  \ntype: integer nullable\n\n**volume_competitor** (10 units): An estimation of the average monthly number of searches for a keyword over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter for a competitor.  \ntype: integer nullable\n\n**volume_target** (10 units): An estimation of the average monthly number of searches for a keyword over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter for a target.  \ntype: integer nullable\n\n**words_competitor**: The number of words in a keyword for a competitor.  \ntype: integer\n\n**words_target**: The number of words in a keyword for a target.  \ntype: integer",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "date_compared": {
                    "description": "A date to compare metrics with in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                }
            },
            "required": [
                "select",
                "target",
                "country",
                "date"
            ],
            "type": "object"
        },
        "name": "site-explorer-organic-competitors"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "country",
                "required": false
            },
            {
                "in": "query",
                "name": "date_compared",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/top-pages",
        "_original_request_body": null,
        "description": "Returns a list of the top-performing pages for a specified website or URL, including detailed SEO metrics (such as organic rankings, traffic, top keyword, and changes over time), with support for comparison between two dates and flexible filtering. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "date_compared": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                },
                "volume_mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target",
                "date"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**keywords**: The total number of keywords that your target ranks for in the top 100 organic search results.  \ntype: integer nullable  \n\n**keywords_diff**: The change in keywords between your selected dates.  \ntype: integer  \n\n**keywords_diff_percent**: The change in keywords between your selected dates, in percents.  \ntype: integer  \n\n**keywords_merged**: The total number of keywords optimized for sorting.  \ntype: integer  \n\n**keywords_prev**: The keyword your target ranks for on the comparison date.  \ntype: integer nullable  \n\n**raw_url**: The ranking page URL in encoded format.  \ntype: string  \n\n**raw_url_prev**: The ranking page URL on the comparison date in encoded format.  \ntype: string nullable  \n\n**status**: The status of a page: the new page that just started to rank (\"left\"), the lost page that disappeared from search results (\"right\"), or no change (\"both\").  \ntype: string  \nenum: `\"left\"` `\"right\"` `\"both\"`  \n\n**sum_traffic**: (10 units) An estimation of the monthly organic search traffic that a page gets from all the keywords that it ranks for.  \ntype: integer nullable  \n\n**sum_traffic_merged**: (10 units) The traffic field optimized for sorting.  \ntype: integer  \n\n**sum_traffic_prev**: (10 units) The traffic on the comparison date.  \ntype: integer nullable  \n\n**top_keyword**: The keyword that brings the most organic traffic to a page.  \ntype: string nullable  \n\n**top_keyword_best_position**: The ranking position that a page holds for its top keyword.  \ntype: integer nullable  \n\n**top_keyword_best_position_diff**: The change in the top position between your selected dates.  \ntype: integer nullable  \n\n**top_keyword_best_position_kind**: The kind of the top position: organic, paid or a SERP feature.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`  \n\n**top_keyword_best_position_kind_prev**: The kind of the top position on the comparison date.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`  \n\n**top_keyword_best_position_prev**: The top position on the comparison date.  \ntype: integer nullable  \n\n**top_keyword_best_position_title**: The title displayed for the page in its top keyword's SERP.  \ntype: string nullable  \n\n**top_keyword_best_position_title_prev**: The title displayed for the page in its top keyword's SERP on the comparison date.  \ntype: string nullable  \n\n**top_keyword_country**: The country in which a page ranks for its top keyword.  \ntype: string nullable  \nenum: `\"AD\"` .. `\"ZW\"`  \n\n**top_keyword_country_prev**: The country in which a page ranks for its top keyword on the comparison date.  \ntype: string nullable  \nenum: `\"AD\"` .. `\"ZW\"`  \n\n**top_keyword_prev**: The keyword that brings the most organic traffic to a page on the comparison date.  \ntype: string nullable  \n\n**top_keyword_volume**: (10 units) An estimation of the average monthly number of searches for the top keyword over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable  \n\n**top_keyword_volume_prev**: (10 units) The search volume on the comparison date.  \ntype: integer nullable  \n\n**traffic_diff**: The change in traffic between your selected dates.  \ntype: integer  \n\n**traffic_diff_percent**: The change in traffic between your selected dates, in percents.  \ntype: integer  \n\n**url**: The ranking page URL.  \ntype: string<url> nullable  \n\n**url_prev**: The ranking page URL on the comparison date.  \ntype: string<url> nullable  \n\n**value**: (10 units) The estimated value of a page's monthly organic search traffic, in USD cents.  \ntype: integer nullable  \n\n**value_diff**: The change in traffic value between your selected dates.  \ntype: integer  \n\n**value_diff_percent**: The change in traffic value between your selected dates, in percents.  \ntype: integer  \n\n**value_merged**: (10 units) The traffic value field optimized for sorting.  \ntype: integer nullable  \n\n**value_prev**: (10 units) The traffic value on the comparison date.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**cpc**  \ntype: integer nullable\n\n**cpc_prev**: The CPC metric on the comparison date.  \ntype: integer nullable\n\n**has_thumbnail**: The position has a thumbnail.  \ntype: boolean\n\n**has_thumbnail_prev**: The position has a thumbnail on the comparison date.  \ntype: boolean\n\n**has_video**: The position has a video.  \ntype: boolean\n\n**has_video_prev**: The position has a video on the comparison date.  \ntype: boolean\n\n**keyword**: The keyword your target ranks for.  \ntype: string\n\n**keyword_difficulty** (10 units): An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable\n\n**keyword_difficulty_prev** (10 units): The keyword difficulty on the comparison date.  \ntype: integer nullable\n\n**keyword_prev**: The keyword your target ranks for on the comparison date.  \ntype: string\n\n**keywords**: The total number of keywords that your target ranks for in the top 100 organic search results.  \ntype: integer\n\n**keywords_diff**: The change in keywords between your selected dates.  \ntype: integer\n\n**keywords_diff_percent**: The change in keywords between your selected dates, in percents.  \ntype: integer\n\n**keywords_merged**: The total number of keywords optimized for sorting.  \ntype: integer\n\n**keywords_prev**: The keyword your target ranks for on the comparison date.  \ntype: integer\n\n**position**: The position your target ranks for in the organic search results for a keyword.  \ntype: integer\n\n**position_kind**: The kind of a position: organic, paid or a SERP feature. This applies to all positions for a given keyword and URL before picking the top position.  \ntype: string  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**position_kind_prev**: The kind of a position on the comparison date.  \ntype: string  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**position_prev**: The position of your target for a given keyword on the comparison date.  \ntype: integer\n\n**raw_url**: The ranking page URL in encoded format.  \ntype: string\n\n**raw_url_prev**: The ranking page URL on the comparison date in encoded format.  \ntype: string\n\n**serp_features**  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**serp_features_prev**: The SERP features on the comparison date.  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**status**: The status of a page: the new page that just started to rank (\"left\"), the lost page that disappeared from search results (\"right\"), or no change (\"both\").  \ntype: string  \nenum: `\"left\"` `\"right\"` `\"both\"`\n\n**sum_traffic** (10 units): An estimation of the monthly organic search traffic that a page gets from all the keywords that it ranks for.  \ntype: integer nullable\n\n**sum_traffic_merged** (10 units): The traffic field optimized for sorting.  \ntype: integer\n\n**sum_traffic_prev** (10 units): The traffic on the comparison date.  \ntype: integer nullable\n\n**top_keyword**: The keyword that brings the most organic traffic to a page.  \ntype: string nullable\n\n**top_keyword_best_position**: The ranking position that a page holds for its top keyword.  \ntype: integer nullable\n\n**top_keyword_best_position_diff**: The change in the top position between your selected dates.  \ntype: integer nullable\n\n**top_keyword_best_position_kind**: The kind of the top position: organic, paid or a SERP feature.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**top_keyword_best_position_kind_prev**: The kind of the top position on the comparison date.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**top_keyword_best_position_prev**: The top position on the comparison date.  \ntype: integer nullable\n\n**top_keyword_best_position_title**: The title displayed for the page in its top keyword's SERP.  \ntype: string nullable\n\n**top_keyword_best_position_title_prev**: The title displayed for the page in its top keyword's SERP on the comparison date.  \ntype: string nullable\n\n**top_keyword_country**: The country in which a page ranks for its top keyword.  \ntype: string nullable  \nenum: `\"AD\"` .. `\"ZW\"`\n\n**top_keyword_country_prev**: The country in which a page ranks for its top keyword on the comparison date.  \ntype: string nullable  \nenum: `\"AD\"` .. `\"ZW\"`\n\n**top_keyword_prev**: The keyword that brings the most organic traffic to a page on the comparison date.  \ntype: string nullable\n\n**top_keyword_volume** (10 units): An estimation of the average monthly number of searches for the top keyword over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable\n\n**top_keyword_volume_prev** (10 units): The search volume on the comparison date.  \ntype: integer nullable\n\n**traffic** (10 units): An estimation of the number of monthly visitors that your target gets from organic search for a keyword.  \ntype: integer\n\n**traffic_diff**: The change in traffic between your selected dates.  \ntype: integer\n\n**traffic_diff_percent**: The change in traffic between your selected dates, in percents.  \ntype: integer\n\n**traffic_prev** (10 units): The traffic from a keyword on the comparison date.  \ntype: integer\n\n**url**: The ranking page URL.  \ntype: url nullable\n\n**url_prev**: The ranking page URL on the comparison date.  \ntype: url nullable\n\n**value** (10 units): The estimated value of a page's monthly organic search traffic, in USD cents.  \ntype: integer nullable\n\n**value_diff**: The change in traffic value between your selected dates.  \ntype: integer\n\n**value_diff_percent**: The change in traffic value between your selected dates, in percents.  \ntype: integer\n\n**value_merged** (10 units): The traffic value field optimized for sorting.  \ntype: integer nullable\n\n**value_prev** (10 units): The traffic value on the comparison date.  \ntype: integer nullable\n\n**volume** (10 units): An estimation of the number of searches for a keyword over the latest month.  \ntype: integer nullable\n\n**volume_prev** (10 units): The search volume on the comparison date.  \ntype: integer nullable\n\n**words**: The number of words in a keyword.  \ntype: integer\n\n**words_prev**: The number of words in a keyword on the comparison date.  \ntype: integer",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "date_compared": {
                    "description": "A date to compare metrics with in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                }
            },
            "required": [
                "select",
                "target",
                "date"
            ],
            "type": "object"
        },
        "name": "site-explorer-top-pages"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "country",
                "required": false
            },
            {
                "in": "query",
                "name": "date_compared",
                "required": false
            },
            {
                "in": "query",
                "name": "date",
                "required": true
            },
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/paid-pages",
        "_original_request_body": null,
        "description": "Returns detailed metrics about pages on a specified site or URL that are ranking in paid search results, including traffic, keyword data, ad presence, and changes over time, with powerful filtering and comparison capabilities. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "date_compared": {
                    "type": "string"
                },
                "date": {
                    "type": "string"
                },
                "volume_mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target",
                "date"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**ads_count**: The number of unique ads with a page.  \ntype: integer nullable  \n\n**ads_count_diff**: The change in ads between your selected dates.  \ntype: integer  \n\n**ads_count_prev**: The number of ads on the comparison date.  \ntype: integer nullable  \n\n**keywords**: The total number of keywords that your target ranks for in paid search results.  \ntype: integer nullable  \n\n**keywords_diff**: The change in keywords between your selected dates.  \ntype: integer  \n\n**keywords_diff_percent**: The change in keywords between your selected dates, in percents.  \ntype: integer  \n\n**keywords_merged**: The total number of keywords optimized for sorting.  \ntype: integer  \n\n**keywords_prev**: The keyword your target ranks for on the comparison date.  \ntype: integer nullable  \n\n**raw_url**: The ranking page URL in encoded format.  \ntype: string  \n\n**raw_url_prev**: The ranking page URL on the comparison date in encoded format.  \ntype: string nullable  \n\n**status**: The status of a page: the new page that just started to rank in paid results (\"left\"), the lost page that disappeared from paid results (\"right\"), or no change (\"both\").  \ntype: string  \nenum: `\"left\"` `\"right\"` `\"both\"`  \n\n**sum_traffic**: (10 units) An estimation of the monthly paid search traffic that a page gets from all the keywords that it ranks for.  \ntype: integer nullable  \n\n**sum_traffic_merged**: (10 units) The paid traffic field optimized for sorting.  \ntype: integer  \n\n**sum_traffic_prev**: (10 units) The paid traffic on the comparison date.  \ntype: integer nullable  \n\n**top_keyword**: The keyword that brings the most paid traffic to a page.  \ntype: string nullable  \n\n**top_keyword_best_position**: The ranking position that a page holds for its top keyword.  \ntype: integer nullable  \n\n**top_keyword_best_position_diff**: The change in the top position between your selected dates.  \ntype: integer nullable  \n\n**top_keyword_best_position_kind**: The kind of the top position: organic, paid or a SERP feature.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`  \n\n**top_keyword_best_position_kind_prev**: The kind of the top position on the comparison date.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`  \n\n**top_keyword_best_position_prev**: The top position on the comparison date.  \ntype: integer nullable  \n\n**top_keyword_best_position_title**: The title displayed for the page in its top keyword's SERP.  \ntype: string nullable  \n\n**top_keyword_best_position_title_prev**: The title displayed for the page in its top keyword's SERP on the comparison date.  \ntype: string nullable  \n\n**top_keyword_country**: The country in which a page ranks for its top keyword.  \ntype: string nullable  \nenum: `\"AD\"` .. `\"ZW\"`  \n\n**top_keyword_country_prev**: The country in which a page ranks for its top keyword on the comparison date.  \ntype: string nullable  \nenum: `\"AD\"` .. `\"ZW\"`  \n\n**top_keyword_prev**: The keyword that brings the most paid traffic to a page on the comparison date.  \ntype: string nullable  \n\n**top_keyword_volume**: (10 units) An estimation of the average monthly number of searches for the top keyword over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable  \n\n**top_keyword_volume_prev**: (10 units) The search volume on the comparison date.  \ntype: integer nullable  \n\n**traffic_diff**: The change in traffic between your selected dates.  \ntype: integer  \n\n**traffic_diff_percent**: The change in traffic between your selected dates, in percents.  \ntype: integer  \n\n**url**: The ranking page URL.  \ntype: string<url> nullable  \n\n**url_prev**: The ranking page URL on the comparison date.  \ntype: string<url> nullable  \n\n**value**: (10 units) The estimated cost of a page's monthly paid search traffic, in USD cents.  \ntype: integer nullable  \n\n**value_diff**: The change in traffic value between your selected dates.  \ntype: integer  \n\n**value_diff_percent**: The change in traffic value between your selected dates, in percents.  \ntype: integer  \n\n**value_merged**: (10 units) The traffic value field optimized for sorting.  \ntype: integer nullable  \n\n**value_prev**: (10 units) The traffic value on the comparison date.  \ntype: integer nullable  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**ads_count**: The number of unique ads with a page.  \ntype: integer\n\n**ads_count_diff**: The change in ads between your selected dates.  \ntype: integer\n\n**ads_count_prev**: The number of ads on the comparison date.  \ntype: integer\n\n**cpc**  \ntype: integer nullable\n\n**cpc_prev**: The CPC metric on the comparison date.  \ntype: integer nullable\n\n**description**: The description of an ad as seen in search results.  \ntype: string\n\n**description_prev**: The description of an ad on the comparison date.  \ntype: string\n\n**has_thumbnail**: The position has a thumbnail.  \ntype: boolean\n\n**has_thumbnail_prev**: The position has a thumbnail on the comparison date.  \ntype: boolean\n\n**has_video**: The position has a video.  \ntype: boolean\n\n**has_video_prev**: The position has a video on the comparison date.  \ntype: boolean\n\n**keyword**: The keyword your target ranks for.  \ntype: string\n\n**keyword_difficulty** (10 units): An estimation of how hard it is to rank in the top 10 organic search results for a keyword on a 100-point scale.  \ntype: integer nullable\n\n**keyword_difficulty_prev** (10 units): The keyword difficulty on the comparison date.  \ntype: integer nullable\n\n**keyword_prev**: The keyword your target ranks for on the comparison date.  \ntype: string\n\n**keywords**: The total number of keywords that your target ranks for in paid search results.  \ntype: integer\n\n**keywords_diff**: The change in keywords between your selected dates.  \ntype: integer\n\n**keywords_diff_percent**: The change in keywords between your selected dates, in percents.  \ntype: integer\n\n**keywords_merged**: The total number of keywords optimized for sorting.  \ntype: integer\n\n**keywords_prev**: The keyword your target ranks for on the comparison date.  \ntype: integer\n\n**position**: The position your target ranks for in the paid search results for a keyword.  \ntype: integer\n\n**position_kind**: The kind of a position: organic, paid or a SERP feature. This applies to all positions for a given keyword and URL before picking the top position.  \ntype: string  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**position_kind_prev**: The kind of a position on the comparison date.  \ntype: string  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**position_prev**: The position of your target for a given keyword on the comparison date.  \ntype: integer\n\n**raw_url**: The ranking page URL in encoded format.  \ntype: string\n\n**raw_url_prev**: The ranking page URL on the comparison date in encoded format.  \ntype: string\n\n**serp_features**  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**serp_features_prev**: The SERP features on the comparison date.  \ntype: array(string)  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"` `\"image_th\"` `\"video_th\"` `\"ai_overview_found\"`\n\n**status**: The status of a page: the new page that just started to rank in paid results (\"left\"), the lost page that disappeared from paid results (\"right\"), or no change (\"both\").  \ntype: string  \nenum: `\"left\"` `\"right\"` `\"both\"`\n\n**sum_traffic** (10 units): An estimation of the monthly paid search traffic that a page gets from all the keywords that it ranks for.  \ntype: integer nullable\n\n**sum_traffic_merged** (10 units): The paid traffic field optimized for sorting.  \ntype: integer\n\n**sum_traffic_prev** (10 units): The paid traffic on the comparison date.  \ntype: integer nullable\n\n**title**: The title of an ad as seen in search results.  \ntype: string\n\n**title_prev**: The title of an ad on the comparison date.  \ntype: string\n\n**top_keyword**: The keyword that brings the most paid traffic to a page.  \ntype: string nullable\n\n**top_keyword_best_position**: The ranking position that a page holds for its top keyword.  \ntype: integer nullable\n\n**top_keyword_best_position_diff**: The change in the top position between your selected dates.  \ntype: integer nullable\n\n**top_keyword_best_position_kind**: The kind of the top position: organic, paid or a SERP feature.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**top_keyword_best_position_kind_prev**: The kind of the top position on the comparison date.  \ntype: string nullable  \nenum: `\"paid_top\"` `\"paid_bottom\"` `\"paid_right\"` `\"paid_sitelink\"` `\"organic\"` `\"sitelink\"` `\"snippet\"` `\"image\"` `\"article\"` `\"knowledge_card\"` `\"knowledge_panel\"` `\"local_pack\"` `\"local_teaser\"` `\"news\"` `\"question\"` `\"review\"` `\"shopping\"` `\"tweet\"` `\"spelling\"` `\"video\"` `\"discussion\"` `\"ai_overview\"` `\"ai_overview_sitelink\"` `\"organic_shopping\"`\n\n**top_keyword_best_position_prev**: The top position on the comparison date.  \ntype: integer nullable\n\n**top_keyword_best_position_title**: The title displayed for the page in its top keyword's SERP.  \ntype: string nullable\n\n**top_keyword_best_position_title_prev**: The title displayed for the page in its top keyword's SERP on the comparison date.  \ntype: string nullable\n\n**top_keyword_country**: The country in which a page ranks for its top keyword.  \ntype: string nullable  \nenum: `\"AD\"` .. `\"ZW\"`\n\n**top_keyword_country_prev**: The country in which a page ranks for its top keyword on the comparison date.  \ntype: string nullable  \nenum: `\"AD\"` .. `\"ZW\"`\n\n**top_keyword_prev**: The keyword that brings the most paid traffic to a page on the comparison date.  \ntype: string nullable\n\n**top_keyword_volume** (10 units): An estimation of the average monthly number of searches for the top keyword over the latest month or over the latest known 12 months of data depending on the \"volume_mode\" parameter.  \ntype: integer nullable\n\n**top_keyword_volume_prev** (10 units): The search volume on the comparison date.  \ntype: integer nullable\n\n**traffic** (10 units): An estimation of the number of monthly visitors that your target gets from paid search for a keyword.  \ntype: integer\n\n**traffic_diff**: The change in traffic between your selected dates.  \ntype: integer\n\n**traffic_diff_percent**: The change in traffic between your selected dates, in percents.  \ntype: integer\n\n**traffic_prev** (10 units): The traffic from a keyword on the comparison date.  \ntype: integer\n\n**url**: The ranking page URL.  \ntype: url nullable\n\n**url_prev**: The ranking page URL on the comparison date.  \ntype: url nullable\n\n**url_visual**: The URL of an ad as seen in search results.  \ntype: string\n\n**url_visual_prev**: The URL of an ad on the comparison date.  \ntype: string\n\n**value** (10 units): The estimated cost of a page's monthly paid search traffic, in USD cents.  \ntype: integer nullable\n\n**value_diff**: The change in traffic value between your selected dates.  \ntype: integer\n\n**value_diff_percent**: The change in traffic value between your selected dates, in percents.  \ntype: integer\n\n**value_merged** (10 units): The traffic value field optimized for sorting.  \ntype: integer nullable\n\n**value_prev** (10 units): The traffic value on the comparison date.  \ntype: integer nullable\n\n**volume** (10 units): An estimation of the number of searches for a keyword over the latest month.  \ntype: integer nullable\n\n**volume_prev** (10 units): The search volume on the comparison date.  \ntype: integer nullable\n\n**words**: The number of words in a keyword.  \ntype: integer\n\n**words_prev**: The number of words in a keyword on the comparison date.  \ntype: integer",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "date_compared": {
                    "description": "A date to compare metrics with in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date": {
                    "description": "A date to report metrics on in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                }
            },
            "required": [
                "select",
                "target",
                "date"
            ],
            "type": "object"
        },
        "name": "site-explorer-paid-pages"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "history",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/best-by-external-links",
        "_original_request_body": null,
        "description": "Returns a list of a site's or URL's best-performing pages, ranked by the number of referring external links, with flexible filtering and sorting options. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                },
                "history": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**dofollow_to_target**: The number of links to your target page that don’t have the “nofollow” attribute.  \ntype: integer  \n\n**first_seen_link**: The date we first found a link to your target.  \ntype: string<date-time>  \n\n**http_code_target**: The return code from HTTP protocol returned during the target page crawl.  \ntype: integer nullable  \n\n**languages_target**: The languages listed in the target page metadata or detected by the crawler to appear in the HTML.  \ntype: array[string]  \n\n**last_seen**: The date your target page lost its last live link.  \ntype: string<date-time> nullable  \n\n**last_visited_source**: The date we last verified a live link to your target page.  \ntype: string<date-time>  \n\n**last_visited_target**: The date we last crawled your target page.  \ntype: string<date-time> nullable  \n\n**links_to_target**: The number of inbound backlinks the target page has.  \ntype: integer  \n\n**lost_links_to_target**: The number of backlinks lost during the selected time period.  \ntype: integer  \n\n**new_links_to_target**: The number of new backlinks found during the selected time period.  \ntype: integer  \n\n**nofollow_to_target**: The number of links to your target page that have the “nofollow” attribute.  \ntype: integer  \n\n**powered_by_target**: Web technologies used to build and serve the target page content.  \ntype: array[string]  \n\n**redirects_to_target**: The number of inbound redirects to your target page.  \ntype: integer  \n\n**refdomains_target**: (5 units) The number of unique referring domains linking to the target page.  \ntype: integer  \n\n**target_redirect**: The target's redirect if any.  \ntype: string nullable  \n\n**title_target**: The html title of the target page.  \ntype: string nullable  \n\n**top_domain_rating_source**: The highest Domain Rating (DR) counted out of all referring domains. DR shows the strength of a website’s backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float>  \n\n**url_rating_target**: The strength of the target page's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float> nullable  \n\n**url_to**: The URL the backlink points to.  \ntype: string<url>  \n\n**url_to_plain**: The target page URL optimized for use as a filter.  \ntype: string  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string\n\n**dofollow_to_target**: The number of links to your target page that don’t have the “nofollow” attribute.  \ntype: integer\n\n**domain_rating_source**: The strength of the referring domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**first_seen_link**: The date we first found a link to your target.  \ntype: datetime\n\n**http_code_source**: The return code from HTTP protocol returned during the referring page crawl.  \ntype: integer\n\n**http_code_target**: The return code from HTTP protocol returned during the target page crawl.  \ntype: integer nullable\n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean\n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean\n\n**is_homepage_link**: The link was found on the homepage of a referring website.  \ntype: boolean\n\n**is_lost**: The link currently does not exist anymore.  \ntype: boolean\n\n**is_new**: The link was discovered on the last crawl.  \ntype: boolean\n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean\n\n**is_non_html**: The link points to a URL with non-HTML content.  \ntype: boolean\n\n**is_root_source**: The referring domain name is a root domain name.  \ntype: boolean\n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean\n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean\n\n**languages_source**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**languages_target**: The languages listed in the target page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**last_seen**: The date your target page lost its last live link.  \ntype: datetime nullable\n\n**last_visited_source**: The date we last verified a live link to your target page.  \ntype: datetime\n\n**last_visited_target**: The date we last crawled your target page.  \ntype: datetime nullable\n\n**len_url_redirect**: The number of redirect chain URLs.  \ntype: integer\n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`\n\n**linked_domains_source**: The number of unique root domains linked from the referring page.  \ntype: integer\n\n**links_external_source**: The number of external links from the referring page.  \ntype: integer\n\n**links_to_target**: The number of inbound backlinks the target page has.  \ntype: integer\n\n**lost_links_to_target**: The number of backlinks lost during the selected time period.  \ntype: integer\n\n**new_links_to_target**: The number of new backlinks found during the selected time period.  \ntype: integer\n\n**nofollow_to_target**: The number of links to your target page that have the “nofollow” attribute.  \ntype: integer\n\n**positions_source**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer\n\n**positions_source_domain**: The number of keywords that the referring domain ranks for in the top 100 positions.  \ntype: integer\n\n**powered_by_source**: Web technologies used to build and serve the referring page content.  \ntype: array(string)\n\n**powered_by_target**: Web technologies used to build and serve the target page content.  \ntype: array(string)\n\n**redirects_to_target**: The number of inbound redirects to your target page.  \ntype: integer\n\n**refdomains_source** (5 units): The number of unique referring domains linking to the referring page.  \ntype: integer\n\n**refdomains_target** (5 units): The number of unique referring domains linking to the target page.  \ntype: integer\n\n**root_name_source**: The root domain name of the referring domain, not including subdomains.  \ntype: string\n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string\n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string\n\n**source_page_author**: The author of the referring page.  \ntype: string nullable\n\n**target_redirect**: The target's redirect if any.  \ntype: string nullable\n\n**title_source**: The html title of the referring page.  \ntype: string\n\n**title_target**: The html title of the target page.  \ntype: string nullable\n\n**top_domain_rating_source**: The highest Domain Rating (DR) counted out of all referring domains. DR shows the strength of a website’s backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**traffic_domain_source** (10 units): The referring domain's estimated monthly organic traffic from search.  \ntype: integer\n\n**traffic_source** (10 units): The referring page's estimated monthly organic traffic from search.  \ntype: integer\n\n**url_from_plain**: The referring page URL optimized for use as a filter.  \ntype: string\n\n**url_rating_source**: The strength of the referring page's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**url_rating_target**: The strength of the target page's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float nullable\n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array(url)\n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array(string)\n\n**url_to**: The URL the backlink points to.  \ntype: string\n\n**url_to_plain**: The target page URL optimized for use as a filter.  \ntype: string",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                },
                "history": {
                    "description": "A time frame to add lost backlinks to the report. Choose between `live` (no history), `since:<date>` (history since a specified date), and `all_time` (full history). The date should be in YYYY-MM-DD format.",
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-best-by-external-links"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "timeout",
                "required": false
            },
            {
                "in": "query",
                "name": "offset",
                "required": false
            },
            {
                "in": "query",
                "name": "limit",
                "required": false
            },
            {
                "in": "query",
                "name": "order_by",
                "required": false
            },
            {
                "in": "query",
                "name": "where",
                "required": false
            },
            {
                "in": "query",
                "name": "select",
                "required": true
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/best-by-internal-links",
        "_original_request_body": null,
        "description": "Retrieves a site's or page's internal link metrics, allowing analysis of how pages within the given domain or URL are interconnected and which pages receive the most internal links. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "timeout": {
                    "type": "integer"
                },
                "limit": {
                    "type": "integer"
                },
                "order_by": {
                    "type": "string"
                },
                "where": {
                    "type": "string"
                },
                "select": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "timeout": {
                    "description": "A manual timeout duration in seconds.",
                    "type": "integer"
                },
                "limit": {
                    "description": "The number of results to return.",
                    "type": "integer"
                },
                "order_by": {
                    "description": "A column to order results by. Example: field_a:desc,field_b:asc\n\nResponse schema:**canonical_to_target**: The number of inbound canonical links to your target page.  \ntype: integer  \n\n**dofollow_to_target**: The number of links to your target page that don’t have the “nofollow” attribute.  \ntype: integer  \n\n**first_seen_link**: The date we first found a link to your target.  \ntype: string<date-time>  \n\n**http_code_target**: The return code from HTTP protocol returned during the target page crawl.  \ntype: integer nullable  \n\n**languages_target**: The languages listed in the target page metadata or detected by the crawler to appear in the HTML.  \ntype: array[string]  \n\n**last_seen**: The date your target page lost its last live link.  \ntype: string<date-time> nullable  \n\n**last_visited_source**: The date we last verified a live link to your target page.  \ntype: string<date-time>  \n\n**last_visited_target**: The date we last crawled your target page.  \ntype: string<date-time> nullable  \n\n**links_to_target**: The number of inbound backlinks the target page has.  \ntype: integer  \n\n**nofollow_to_target**: The number of links to your target page that have the “nofollow” attribute.  \ntype: integer  \n\n**powered_by_target**: Web technologies used to build and serve the target page content.  \ntype: array[string]  \n\n**redirects_to_target**: The number of inbound redirects to your target page.  \ntype: integer  \n\n**target_redirect**: The target's redirect if any.  \ntype: string nullable  \n\n**title_target**: The html title of the target page.  \ntype: string nullable  \n\n**url_rating_target**: The strength of the target page's backlink profile compared to the others in our database on a 100-point scale.  \ntype: number<float> nullable  \n\n**url_to**: The URL the backlink points to.  \ntype: string<url>  \n\n**url_to_plain**: The target page URL optimized for use as a filter.  \ntype: string  \n\n",
                    "type": "string"
                },
                "where": {
                    "description": "The filter expression. Example: {\"or\":[{\"field\":\"foo\",\"modifier\":\"uppercase\",\"is\":[\"eq\",\"AHREFS\"]},{\"field\":\"bar\",\"list_is\":{\"and\":[[\"prefix\",\"Ahrefs\"],[\"suffix\",\"seo\"]]}}]}.\nThe syntax is described by the following grammar, expressed in BNF-style notation.\nA term enclosed in angle brackets < and > denotes a symbol. A symbol followed by a + denotes a non-empty array containing the symbol. A ? preceding an object field indicates that the field is optional.\nThe two terminal symbols are defined as follows:\n<field_alias> A filter field alias.\n<value> A JSON value. It should match the type of the field (or of the field's modifier, if one is present).\nPermitted patterns in regex: RE2 syntax..\n<bool_filter> ::= { \"and\" : <bool_filter>+ }\n              |   { \"or\" : <bool_filter>+ }\n              |   { \"not\" : <bool_filter> }\n              |   <expr>\n\n<expr> ::= {\n             \"field\" : <field_alias>,\n             ? \"is\": <condition>,\n             ? \"list_is\": <list_condition>\n           }\n\n<condition> ::= [ \"eq\", <value> ]\n            |   [ \"neq\", <value> ]\n            |   [ \"gt\", <value> ]\n            |   [ \"gte\", <value> ]\n            |   [ \"lt\", <value> ]\n            |   [ \"lte\", <value> ]\n            |   [ \"substring\", <value> ]\n            |   [ \"isubstring\", <value> ]\n            |   [ \"phrase_match\", <value> ]\n            |   [ \"iphrase_match\", <value> ]\n            |   [ \"prefix\", <value> ]\n            |   [ \"suffix\", <value> ]\n            |   [ \"regex\", <value> ]\n            |   \"empty\"\n            |   \"is_null\"\n\n<condition_bool_filter> ::= { \"and\" : <condition_bool_filter>+ }\n                        |   { \"or\" : <condition_bool_filter>+ }\n                        |   { \"not\" : <condition_bool_filter> }\n                        |   <condition>\n\n<list_condition> ::= { \"any\" : <condition_bool_filter> }\n                 |   { \"all\" : <condition_bool_filter> }\n The following column identifiers are recognized (this differs from the identifiers recognized by the `select` parameter).\n\n**anchor**: The clickable words in a link that point to a URL.  \ntype: string\n\n**canonical_to_target**: The number of inbound canonical links to your target page.  \ntype: integer\n\n**dofollow_to_target**: The number of links to your target page that don’t have the “nofollow” attribute.  \ntype: integer\n\n**domain_rating_source**: The strength of the referring domain's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**first_seen_link**: The date we first found a link to your target.  \ntype: datetime\n\n**http_code_source**: The return code from HTTP protocol returned during the referring page crawl.  \ntype: integer\n\n**http_code_target**: The return code from HTTP protocol returned during the target page crawl.  \ntype: integer nullable\n\n**is_content**: The link was found in the biggest piece of content on the page.  \ntype: boolean\n\n**is_dofollow**: The link has no special nofollow attribute.  \ntype: boolean\n\n**is_homepage_link**: The link was found on the homepage of a referring website.  \ntype: boolean\n\n**is_nofollow**: The link or the referring page has the nofollow attribute set.  \ntype: boolean\n\n**is_non_html**: The link points to a URL with non-HTML content.  \ntype: boolean\n\n**is_root_source**: The referring domain name is a root domain name.  \ntype: boolean\n\n**is_sponsored**: The link has the Sponsored attribute set in the referring page HTML.  \ntype: boolean\n\n**is_ugc**: The link has the User Generated Content attribute set in the referring page HTML.  \ntype: boolean\n\n**languages_source**: The languages listed in the referring page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**languages_target**: The languages listed in the target page metadata or detected by the crawler to appear in the HTML.  \ntype: array(string)\n\n**last_seen**: The date your target page lost its last live link.  \ntype: datetime nullable\n\n**last_visited_source**: The date we last verified a live link to your target page.  \ntype: datetime\n\n**last_visited_target**: The date we last crawled your target page.  \ntype: datetime nullable\n\n**len_url_redirect**: The number of redirect chain URLs.  \ntype: integer\n\n**link_type**: The kind of the backlink.  \ntype: string  \nenum: `\"redirect\"` `\"frame\"` `\"text\"` `\"form\"` `\"canonical\"` `\"alternate\"` `\"rss\"` `\"image\"`\n\n**linked_domains_source**: The number of unique root domains linked from the referring page.  \ntype: integer\n\n**links_external_source**: The number of external links from the referring page.  \ntype: integer\n\n**links_to_target**: The number of inbound backlinks the target page has.  \ntype: integer\n\n**nofollow_to_target**: The number of links to your target page that have the “nofollow” attribute.  \ntype: integer\n\n**positions_source**: The number of keywords that the referring page ranks for in the top 100 positions.  \ntype: integer\n\n**positions_source_domain**: The number of keywords that the referring domain ranks for in the top 100 positions.  \ntype: integer\n\n**powered_by_source**: Web technologies used to build and serve the referring page content.  \ntype: array(string)\n\n**powered_by_target**: Web technologies used to build and serve the target page content.  \ntype: array(string)\n\n**redirects_to_target**: The number of inbound redirects to your target page.  \ntype: integer\n\n**refdomains_source** (5 units): The number of unique referring domains linking to the referring page.  \ntype: integer\n\n**root_name_source**: The root domain name of the referring domain, not including subdomains.  \ntype: string\n\n**snippet_left**: The snippet of text appearing just before the link.  \ntype: string\n\n**snippet_right**: The snippet of text appearing just after the link.  \ntype: string\n\n**source_page_author**: The author of the referring page.  \ntype: string nullable\n\n**target_redirect**: The target's redirect if any.  \ntype: string nullable\n\n**title_source**: The html title of the referring page.  \ntype: string\n\n**title_target**: The html title of the target page.  \ntype: string nullable\n\n**traffic_domain_source** (10 units): The referring domain's estimated monthly organic traffic from search.  \ntype: integer\n\n**traffic_source** (10 units): The referring page's estimated monthly organic traffic from search.  \ntype: integer\n\n**url_from_plain**: The referring page URL optimized for use as a filter.  \ntype: string\n\n**url_rating_source**: The strength of the referring page's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float\n\n**url_rating_target**: The strength of the target page's backlink profile compared to the others in our database on a 100-point scale.  \ntype: float nullable\n\n**url_redirect**: A redirect chain the target URL of the link points to.  \ntype: array(url)\n\n**url_redirect_with_target**: The target URL of the link with its redirect chain.  \ntype: array(string)\n\n**url_to**: The URL the backlink points to.  \ntype: string\n\n**url_to_plain**: The target page URL optimized for use as a filter.  \ntype: string",
                    "type": "string"
                },
                "select": {
                    "description": "A mandatory comma-separated list of columns to return. Example: field_a,field_b,field_c See response schema for valid column identifiers.",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                }
            },
            "required": [
                "select",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-best-by-internal-links"
    },
    {
        "_original_method": "GET",
        "_original_parameters": [
            {
                "in": "query",
                "name": "volume_mode",
                "required": false
            },
            {
                "in": "query",
                "name": "top_positions",
                "required": false
            },
            {
                "in": "query",
                "name": "history_grouping",
                "required": false
            },
            {
                "in": "query",
                "name": "date_to",
                "required": false
            },
            {
                "in": "query",
                "name": "date_from",
                "required": true
            },
            {
                "in": "query",
                "name": "country",
                "required": false
            },
            {
                "in": "query",
                "name": "protocol",
                "required": false
            },
            {
                "in": "query",
                "name": "target",
                "required": true
            },
            {
                "in": "query",
                "name": "mode",
                "required": false
            },
            {
                "in": "query",
                "name": "output",
                "required": false
            }
        ],
        "_original_path": "site-explorer/total-search-volume-history",
        "_original_request_body": null,
        "description": "Retrieves the historical total organic search volume, traffic, and traffic value for a given site or URL over a specified time period and grouping. Use doc tool first to get the real input schema.",
        "inputSchema": {
            "properties": {
                "volume_mode": {
                    "type": "string"
                },
                "top_positions": {
                    "type": "string"
                },
                "history_grouping": {
                    "type": "string"
                },
                "date_to": {
                    "type": "string"
                },
                "date_from": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "protocol": {
                    "type": "string"
                },
                "target": {
                    "type": "string"
                },
                "mode": {
                    "type": "string"
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "_inputSchema": {
            "properties": {
                "volume_mode": {
                    "description": "The search volume calculation mode: monthly or average. It affects volume, traffic, and traffic value.",
                    "type": "string",
                    "enum": [
                        "monthly",
                        "average"
                    ]
                },
                "top_positions": {
                    "description": "The number of top organic search positions to consider when calculating total search volume.",
                    "type": "string",
                    "enum": [
                        "top_10",
                        "top_100"
                    ]
                },
                "history_grouping": {
                    "description": "The time interval used to group historical data.",
                    "type": "string",
                    "enum": [
                        "daily",
                        "weekly",
                        "monthly"
                    ]
                },
                "date_to": {
                    "description": "The end date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "date_from": {
                    "description": "The start date of the historical period in YYYY-MM-DD format.",
                    "type": "string",
                    "format": "date"
                },
                "country": {
                    "description": "A two-letter country code (ISO 3166-1 alpha-2): \"AD\" .. \"ZW\"",
                    "type": "string"
                },
                "protocol": {
                    "description": "The protocol of your target.",
                    "type": "string",
                    "enum": [
                        "both",
                        "http",
                        "https"
                    ]
                },
                "target": {
                    "description": "The target of the search: a domain or a URL.",
                    "type": "string"
                },
                "mode": {
                    "description": "The scope of the search based on the target you entered.\n- exact: analyze a single specific URL (e.g., example.com/page) - use for individual pages.\n- prefix: analyze all pages under a specific path (e.g., example.com/blog/*) - use for sections of a site.\n- domain: analyze ONLY the exact domain entered WITHOUT any subdomains - use when you want to exclude subdomains from analysis.\n- subdomains: analyze the main domain AND ALL its subdomains - use by default.",
                    "type": "string",
                    "enum": [
                        "exact",
                        "prefix",
                        "domain",
                        "subdomains"
                    ]
                }
            },
            "required": [
                "date_from",
                "target"
            ],
            "type": "object"
        },
        "name": "site-explorer-total-search-volume-history"
    },
    {
        "description": "Full documentation for Ahrefs tools. You must use this tool to get the input schema for any other tool.",
        "inputSchema": {
            "properties": {
                "tool": {
                    "description": "The name of the tool.",
                    "type": "string"
                }
            },
            "required": [],
            "type": "object"
        },
        "name": "doc"
    }
];

function mapApiErrorToMcpError(error: unknown): McpError {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        // Attempt to get a meaningful message from response data or default Axios message
        const apiMessage = (axiosError.response?.data as any)?.error || (axiosError.response?.data as any)?.message || (axiosError.response?.data as any)?.detail || axiosError.message;

        console.error(`API Error: Status ${status}, Message: ${apiMessage}`, axiosError.response?.data);

        switch (status) {
            case 400: return new McpError(ErrorCode.InvalidParams, `API Bad Request: ${apiMessage}`);
            case 404: return new McpError(ErrorCode.MethodNotFound, `API Not Found: ${apiMessage}`);
            case 408: return new McpError(ErrorCode.RequestTimeout, `API Request Timeout: ${apiMessage}`);
            case 500: case 502: case 503: case 504:
                return new McpError(ErrorCode.InternalError, `API Server Error (${status}): ${apiMessage}`);
            default:
                return new McpError(ErrorCode.InternalError, `API Request Failed (${status}): ${apiMessage}`);
        }
    } else if (error instanceof Error) {
        console.error(`Request Error: ${error.message}`, error);
        return new McpError(ErrorCode.InternalError, `Request failed: ${error.message}`);
    } else {
        console.error('Unknown internal error occurred:', error);
        return new McpError(ErrorCode.InternalError, 'An unknown internal error occurred');
    }
}


export class OpenApiMcpServer {
    public server: Server; // Make server public for transport connection
    private axiosInstance = axios.create({
        baseURL: API_BASE_URL, // Axios will use this as the base for requests
        timeout: 30000, // 30 second timeout
    });

    constructor() {
        console.error(`Initializing MCP Server: ahrefs v3.0.0`);
        console.error(`Using API Base URL: ${API_BASE_URL}`);
        if (!API_KEY) {
            console.error("No API Key found. Assuming public API or auth handled differently.");
        }

        this.server = new Server(
            { name: 'ahrefs', version: '3.0.0' },
            { capabilities: { resources: {}, tools: {} } }
        );
        this.setupRequestHandlers();
        this.setupGracefulShutdown();
        this.server.onerror = (error) => console.error('[MCP Server Error]', error);
    }

    private setupGracefulShutdown(): void {
        process.on('SIGINT', async () => {
            console.error("Received SIGINT, shutting down server...");
            await this.server.close();
            console.error("Server closed.");
            process.exit(0);
        });
        process.on('SIGTERM', async () => {
            console.error("Received SIGTERM, shutting down server...");
            await this.server.close();
            console.error("Server closed.");
            process.exit(0);
        });
    }

    private setupRequestHandlers(): void {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            console.error("Handling ListTools request");
            return { tools };
        });

        this.server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
            const toolName = request.params.name;
            const args = request.params.arguments || {};
            console.error(`Received CallTool request for: ${toolName}`, args);

            if (toolName === "doc") {
                const requestedToolName = String(args.tool).split('_').pop();
                const requestedTool = tools.find(t => t.name === requestedToolName);
                if (!requestedTool) {
                    console.error(`Tool not found: ${requestedToolName}`);
                    throw new McpError(ErrorCode.MethodNotFound, `Tool '${requestedToolName}' not found.`);
                }
                return { content: [{ type: 'text', text: JSON.stringify(requestedTool._inputSchema, null, 2) }] };
            }

            const tool = tools.find(t => t.name === toolName);
            if (!tool) {
                console.error(`Tool not found: ${toolName}`);
                throw new McpError(ErrorCode.MethodNotFound, `Tool '${toolName}' not found.`);
            }

            // Retrieve original OpenAPI details attached during generation
            const originalMethod = (tool as any)._original_method as Method; // Cast to Axios Method type
            const originalPath = (tool as any)._original_path as string;
            const originalParameters = (tool as any)._original_parameters as any[] || [];
            const originalRequestBodyInfo = (tool as any)._original_request_body as { required: boolean, content_type: string | null } | null;

            if (!originalMethod || !originalPath) {
                console.error(`Missing original operation details for tool: ${toolName}`);
                throw new McpError(ErrorCode.InternalError, `Internal configuration error for tool '${toolName}'.`);
            }

            try {
                let targetPath = originalPath;
                const queryParams: Record<string, any> = {};
                const headers: Record<string, string> = {
                    'Accept': 'application/json',
                    'User-Agent': 'ahrefs-mcp-server'
                };
                let requestData: any = undefined;
                let requestBody: any = args.requestBody;
                headers["Authorization"] = `Bearer ${API_KEY}`;

                // Process parameters based on their 'in' location
                for (const param of originalParameters) {
                    const paramName = param.name;
                    const paramIn = param.in; // path, query, header
                    let paramValue = args[paramName];

                    // Lowercase specific parameters
                    if (paramValue !== undefined && paramValue !== null && ["us_state", "country", "country_code"].includes(paramName)) {
                        paramValue = String(paramValue).toLowerCase();
                    }

                    if (paramValue !== undefined && paramValue !== null) {
                        if (paramIn === 'path') {
                            targetPath = targetPath.replace(`{${paramName}}`, encodeURIComponent(String(paramValue)));
                        } else if (paramIn === 'query') {
                            queryParams[paramName] = paramValue;
                        } else if (paramIn === 'header') {
                            headers[paramName] = String(paramValue);
                        } else if (paramIn === 'body') {
                            if (!requestBody) {
                                requestBody = {};
                            }
                            requestBody[paramName] = paramValue;
                        }
                    } else if (param.required) {
                        console.error(`Missing required parameter '${paramName}' for tool ${toolName}`);
                        throw new McpError(ErrorCode.InvalidParams, `Missing required parameter: ${paramName}`);
                    }
                }

                // Process requestBody
                if (originalRequestBodyInfo && requestBody !== undefined && requestBody !== null) {
                    requestData = requestBody;
                    headers['Content-Type'] = originalRequestBodyInfo.content_type || 'application/json';
                } else if (originalRequestBodyInfo?.required) {
                    console.error(`Missing required requestBody for tool ${toolName}`);
                    throw new McpError(ErrorCode.InvalidParams, `Missing required requestBody`);
                } else if (requestData !== undefined) {
                    headers['Content-Type'] = 'application/json';
                }

                // Make API Call - Axios combines baseURL and url
                const requestUrl = targetPath; // Use the path directly
                console.error(`Making API call: ${originalMethod} ${this.axiosInstance.defaults.baseURL}${requestUrl}`);
                const response = await this.axiosInstance.request({
                    method: originalMethod,
                    url: requestUrl, // Use the relative path; Axios combines it with baseURL
                    params: queryParams,
                    headers: headers,
                    data: requestData,
                    validateStatus: (status) => status >= 200 && status < 300, // Only 2xx are considered success
                });

                console.error(`API call successful for ${toolName}, Status: ${response.status}`);

                // Format Response for MCP
                let responseText: string;
                const responseContentType = response.headers['content-type'];
                if (responseContentType && responseContentType.includes('application/json') && typeof response.data === 'object') {
                    try {
                        responseText = JSON.stringify(response.data, null, 2); // Pretty-print JSON
                    } catch (e) {
                        console.error("Failed to stringify JSON response, returning as string.", e);
                        responseText = String(response.data);
                    }
                } else {
                    responseText = String(response.data); // Return non-JSON as plain text
                }

                return { content: [{ type: 'text', text: responseText }] };

            } catch (error) {
                console.error(`Error during API call for tool ${toolName}:`, error);
                const mcpError = mapApiErrorToMcpError(error);
                return {
                    content: [{ type: 'text', text: mcpError.message }],
                    isError: true,
                    error: mcpError, // Include structured error
                };
            }
        });
    }
}
