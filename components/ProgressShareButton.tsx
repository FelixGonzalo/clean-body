import { onShare } from "@/utils/onShare";
import { useState } from "react";
import { Button, ConfirmButton } from "./Button";

export const ProgressShareButton = ({ user, isConfirmButton = false }: { user: any, isConfirmButton?: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!user) return
    const url = `${window.location.origin}/devs/${user.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
    onShare("Porque un cuerpo sano compila mejor", url); // opcional, si aún necesitas llamarlo
  };

  if (isConfirmButton) {
    return (
      <ConfirmButton onClick={handleShare}>
        {copied ? "¡Link copiado! Compártelo" : "Compartir mi progreso"}
      </ConfirmButton>
    )
  }

  return (
    <Button onClick={handleShare}>
      {copied ? "¡Link copiado! Compártelo" : "Compartir mi progreso"}
    </Button>
  )
}
