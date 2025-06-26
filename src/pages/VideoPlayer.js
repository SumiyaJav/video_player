import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');

  const generateRandomUser = () => 'user_' + Math.random().toString(36).substring(2, 8);

  useEffect(() => {

    axios.get(`https://take-home-assessment-423502.uc.r.appspot.com/api/videos/single?video_id=${id}`)
        .then((res) => {
          setVideo(res.data.video);
          const vid = res.data.video;
          if (vid?.video_url?.includes('youtube.com') || vid?.video_url?.includes('youtu.be')) {
            try {
              const url = new URL(vid.video_url);
              const videoId = url.searchParams.get('v') || url.pathname.split('/').pop();
              setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
            } catch (err) {
              console.error('Invalid YouTube URL:', vid.video_url);
            }
          }
        });

    axios.get(`https://take-home-assessment-423502.uc.r.appspot.com/api/videos/comments?video_id=${id}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setComments(res.data);
        } else if (Array.isArray(res.data.comments)) {
          setComments(res.data.comments);
        } else {
          setComments([]);
        }
      });
  }, [id]);

  const postComment = async () => {
    const user_id = generateRandomUser();
    await axios.post(`https://take-home-assessment-423502.uc.r.appspot.com/api/videos/comments`, {
      user_id,
      content: newComment,
      video_id: id
    });
    setNewComment('');
    const res = await axios.get(`https://take-home-assessment-423502.uc.r.appspot.com/api/videos/comments?video_id=${id}`);
    if (Array.isArray(res.data)) {
      setComments(res.data);
    } else if (Array.isArray(res.data.comments)) {
      setComments(res.data.comments);
    } else {
      setComments([]);
    }
  };

  
  if (!video) return <div>Loading...</div>;

  const isYouTube = !!embedUrl;

  return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        {isYouTube ? (
          <iframe
            className="w-full max-w-3xl aspect-video"
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

        ) : (
          <video
            src={video.video_url || video.url}
            controls
            className="w-full max-w-3xl"
            preload="metadata"
            onError={() => console.error('Failed to load video')}
          >
            Your browser does not support the video tag.
          </video>
        )}
        <p className="mt-2 text-gray-700">{video.description}</p>

        <div className="mt-4">
          <h2 className="text-xl font-semibold">Comments</h2>
          <ul className="space-y-2 mt-2">
            {comments.map((comment, idx) => (
              <li key={idx} className="bg-gray-100 p-2 rounded">
                <strong>{comment.user_id}:</strong> {comment.content}
              </li>
            ))}
          </ul>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border mt-2"
            placeholder="Write a comment..."
          />
          <button onClick={postComment} className="bg-green-600 text-white px-3 py-1 rounded mt-2">Post Comment</button>
        </div>
      </div>
  );
}

export default VideoPlayer;