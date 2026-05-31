"use client"

import { useState } from "react"
import { teamMessages, teamMembers, chatChannels } from "@/lib/nexus-data"
import { Search, Plus, Hash, Lock, Users, Send, Smile, Paperclip, AtSign, MoreVertical, Phone, Video, Pin, Star, Bell, BellOff, ChevronDown } from "lucide-react"

export function TeamChat() {
  const [selectedChannel, setSelectedChannel] = useState(chatChannels[0]?.id || "general")
  const [message, setMessage] = useState("")
  const [showMembers, setShowMembers] = useState(true)

  const currentChannel = chatChannels.find(c => c.id === selectedChannel)
  const channelMessages = teamMessages.filter(m => m.channelId === selectedChannel)

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-4 animate-in fade-in duration-500">
      {/* Channels Sidebar */}
      <div className="w-64 bg-zinc-900/50 border border-zinc-800/50 rounded-xl flex flex-col">
        <div className="p-4 border-b border-zinc-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search channels..."
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Channels</span>
              <button className="p-1 hover:bg-zinc-800/50 rounded transition-colors">
                <Plus className="h-3 w-3 text-zinc-500" />
              </button>
            </div>
            <div className="space-y-0.5">
              {chatChannels.filter(c => c.type === "channel").map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all ${selectedChannel === channel.id ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}
                >
                  {channel.isPrivate ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                  <span className="truncate">{channel.name}</span>
                  {channel.unread > 0 && (
                    <span className="ml-auto bg-cyan-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{channel.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Direct Messages</span>
              <button className="p-1 hover:bg-zinc-800/50 rounded transition-colors">
                <Plus className="h-3 w-3 text-zinc-500" />
              </button>
            </div>
            <div className="space-y-0.5">
              {chatChannels.filter(c => c.type === "dm").map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all ${selectedChannel === channel.id ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}
                >
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                      {channel.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${channel.isOnline ? "bg-emerald-500" : "bg-zinc-600"}`} />
                  </div>
                  <span className="truncate">{channel.name}</span>
                  {channel.unread > 0 && (
                    <span className="ml-auto bg-cyan-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{channel.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-zinc-800/50">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                BG
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-zinc-900 bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">Bhavesh Gajengi</p>
              <p className="text-xs text-zinc-500">Online</p>
            </div>
            <button className="p-1.5 hover:bg-zinc-800/50 rounded-lg transition-colors">
              <MoreVertical className="h-4 w-4 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-xl flex flex-col">
        {/* Channel Header */}
        <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentChannel?.type === "channel" ? (
              currentChannel.isPrivate ? <Lock className="h-5 w-5 text-zinc-400" /> : <Hash className="h-5 w-5 text-zinc-400" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                {currentChannel?.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
            )}
            <div>
              <h3 className="text-white font-medium">{currentChannel?.name}</h3>
              <p className="text-xs text-zinc-500">{currentChannel?.description || "Direct message"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
              <Phone className="h-4 w-4 text-zinc-400" />
            </button>
            <button className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
              <Video className="h-4 w-4 text-zinc-400" />
            </button>
            <button className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
              <Pin className="h-4 w-4 text-zinc-400" />
            </button>
            <button 
              onClick={() => setShowMembers(!showMembers)}
              className={`p-2 rounded-lg transition-colors ${showMembers ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-zinc-800/50 text-zinc-400"}`}
            >
              <Users className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {channelMessages.map((msg, i) => {
                const sender = teamMembers.find(m => m.id === msg.senderId)
                const showAvatar = i === 0 || channelMessages[i - 1].senderId !== msg.senderId
                return (
                  <div key={msg.id} className={`flex gap-3 ${!showAvatar ? "pl-11" : ""} group`}>
                    {showAvatar && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {sender?.name.split(" ").map(n => n[0]).join("") || "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-white font-medium">{sender?.name}</span>
                          <span className="text-xs text-zinc-600">{msg.time}</span>
                        </div>
                      )}
                      <p className="text-sm text-zinc-300">{msg.content}</p>
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {msg.reactions.map((reaction, j) => (
                            <button key={j} className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-800/50 rounded text-xs hover:bg-zinc-700/50 transition-colors">
                              <span>{reaction.emoji}</span>
                              <span className="text-zinc-400">{reaction.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button className="p-1 hover:bg-zinc-800/50 rounded transition-colors">
                        <Smile className="h-3.5 w-3.5 text-zinc-500" />
                      </button>
                      <button className="p-1 hover:bg-zinc-800/50 rounded transition-colors">
                        <MoreVertical className="h-3.5 w-3.5 text-zinc-500" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-zinc-800/50">
              <div className="flex items-end gap-3">
                <div className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Message #${currentChannel?.name}`}
                    rows={1}
                    className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none resize-none"
                  />
                  <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-700/30">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-zinc-700/50 rounded transition-colors">
                        <Paperclip className="h-4 w-4 text-zinc-400" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-700/50 rounded transition-colors">
                        <AtSign className="h-4 w-4 text-zinc-400" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-700/50 rounded transition-colors">
                        <Smile className="h-4 w-4 text-zinc-400" />
                      </button>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg text-sm transition-colors">
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Members Sidebar */}
          {showMembers && (
            <div className="w-56 border-l border-zinc-800/50 p-4 overflow-y-auto animate-in slide-in-from-right duration-200">
              <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Members - {teamMembers.length}</h4>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2 p-2 hover:bg-zinc-800/30 rounded-lg transition-colors cursor-pointer">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${member.status === "online" ? "bg-emerald-500" : member.status === "away" ? "bg-amber-500" : "bg-zinc-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{member.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
