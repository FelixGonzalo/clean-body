'use client'

import { IUserChallenge } from "@/types/IChallenge";
import { onShare } from "@/utils/onShare";
import { useState } from "react";
import { Badge } from "./Badge";
import { ConfirmButton } from "./Button";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";

export const ChallengeCard = ({ userChallenge, todayStr}: { userChallenge: IUserChallenge, todayStr?: string}) => {
  const isToday = todayStr ? new Date(userChallenge.created_at).toISOString().substring(0, 10) === todayStr : false;
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/challenges/${userChallenge.challenge.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
    onShare("Te desafío a que lo hagas", url); // opcional, si aún necesitas llamarlo
  };

  return (
    <Link href={`/challenges/${userChallenge.challenge.id}`}>
      <article key={userChallenge.id} className="border-l-3 border-gray-900 rounded-r-lg p-4 duration-300 hover:shadow-xl shadow-gray-700/5">
        <h2>
          {userChallenge.challenge?.title}
        </h2>
        <div className="mt-1 mb-3">
          <Badge>
            {userChallenge.challenge?.category}
          </Badge>
          <span className="ml-1 text-gray-500 inline-block rounded-sm text-sm lowercase">
            {formatDate(userChallenge.created_at)}
          </span>
        </div>
        {isToday && (
          <ConfirmButton onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleShare()
          }}>
            {copied ? "¡Link copiado! Compártelo" : "¡Desafía ahora!"}
          </ConfirmButton>
        )}
      </article>
    </Link>
  )
}
