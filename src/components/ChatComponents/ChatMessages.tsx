import React from "react";
import RecieverMessage from "./RecieverMessage";
import SenderMessage from "./SenderMessage";
import Advertisement from "./Advertisement";
import CircularLoading from "./CircularLoading";
import EmptyMessages from "./EmptyMessages";

export default function ChatMessages() {
  return (
    <div className="w-[100%] h-[88%] px-[3%] overflow-y-scroll no-scrollbar py-[2%] box-border relative flex flex-col">
      {/* Loading state */}
      <CircularLoading />
      
      {/* Empty messages state */}
      <EmptyMessages />
      
      {/* Message content */}
      <div>
        {/* Date header */}
        <div className="flex justify-center">
          <div className="rounded-md px-2.5 py-1.5 my-4 bg-slate-200 text-slate-600 font-normal text-sm">
            Today
          </div>
        </div>

        {/* Sender message */}
        <SenderMessage time="2024-11-24T10:00:00" content="Hello, world!" />

        {/* Receiver message */}
        <RecieverMessage
          isGroupChat={false}
          name="John Doe"
          img="profile.jpg"
          messages={[]}
          index={0}
          content="Hi, how are you?"
          time="2024-11-24T10:01:00"
        />
      </div>
    </div>
  );
}
