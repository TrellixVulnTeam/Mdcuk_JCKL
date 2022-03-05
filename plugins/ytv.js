let limit = 50

let fetch = require('node-fetch')

const { servers, ytv } = require('../lib/y2mate')

let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  if (!args || !args[0]) throw `😒😒😒`

  let chat = global.db.data.chats[m.chat]

  let server = (args[1] || servers[0]).toLowerCase()

  try {

    let { dl_link, thumb, title, filesize, filesizeF } = await ytv(args[0], servers.includes(server) ? server : servers[0])

    let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < filesize

    m.reply(isLimit ? `Ukuran File: ${filesizeF}\nUkuran file diatas ${limit} MB, download sendiri: ${dl_link}` : global.wait)

    let _thumb = {}

    try { _thumb = { thumbnail: await (await fetch(thumb)).buffer() } }

    catch (e) { }

    if (!isLimit) conn.sendFile(m.chat, dl_link, '', `

*නම:* ${title}

*File:* ${filesizeF}

  `.trim(), m, 0, {

      ..._thumb,

      asDocument: chat.useDocument

    })

  } catch (e) {

    return await conn.sendButton(m.chat, 'Server Error', watermark, 'Coba lagi', `${usedPrefix + command} ${args[0]}`, m)

  }

}

handler.help = ['mp4', 'v', ''].map(v => 'yt' + v + ` <url> [server: ${servers.join(', ')}]`)

handler.tags = ['downloader']

handler.command = /^yt(k|mp4)|mp4?$/i

handler.limit = true

module.exports = handler
