

  import type { EventHandler } from "commandkit";

const VERIFIED_ROLE_ID = process.env.MEMBER_ROLE;
const UNVERIFIED_ROLE_ID = process.env.UNVERIFIED_ROLE;
import * as proxyHelper from "../../helpers/proxyHelper";

const KEYWORD = "starburst";

const handler: EventHandler<"messageCreate"> = async (message) => {

// if(message.attachments){
//     console.log(message.attachments)
// }
await proxyHelper.proxyCheck(message.client, message.author.id, message.channelId, message.content);
//wait proxyHelper.isProxy(message.author.id, message.content);
//     message.attachments.at(1)?.url;
//   message.attachments.at(1)?.contentType
};

export default handler;
