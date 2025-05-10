import React from 'react';
import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface ShareButtonsProps {
  productUrl: string;
  title: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ productUrl, title }) => {
  const encodedUrl = encodeURIComponent(productUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareOptions = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877f2]'
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-[#1da1f2]'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: 'bg-[#0a66c2]'
    }
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600 flex items-center gap-1">
        <Share2 size={20} />
        Share:
      </span>
      {shareOptions.map((option) => (
        <button
          key={option.name}
          onClick={() => handleShare(option.url)}
          className={`${option.color} text-white p-2 rounded-full hover:opacity-90 transition-opacity`}
          title={`Share on ${option.name}`}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
};