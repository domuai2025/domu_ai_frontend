import React, { useState } from 'react';

interface Post {
  content: string;
  platform: 'twitter' | 'linkedin' | 'facebook';
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'published';
}

export function ContentCalendar() {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = () => {
    setPosts([...posts, {
      content: "New post",
      platform: "twitter",
      scheduledTime: new Date(),
      status: "draft"
    }]);
  };

  return (
    <div>
      <button onClick={addPost}>Add Post</button>
      {/* Basic implementation to use Post interface */}
      {posts.map((post, index) => (
        <div key={index}>
          <p>{post.content}</p>
          <span>{post.platform}</span>
          <span>{post.status}</span>
        </div>
      ))}
    </div>
  );
}