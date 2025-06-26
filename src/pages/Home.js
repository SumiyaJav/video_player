import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://take-home-assessment-423502.uc.r.appspot.com/api/videos?user_id=sumiyajav_sarangerel')
      .then((res) => {
        console.log('Video API response:', res.data);

        if (Array.isArray(res.data)) {
          setVideos(res.data.slice(0, 10));
        } else if (Array.isArray(res.data.videos)) {
          setVideos(res.data.videos.slice(0, 10));
        }
        else {
          setVideos([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching videos:', err.response?.data || err.message);
        setError('Failed to fetch videos.');
      })
      .finally(() => setLoading(false));
  }, []);

  const getThumbnail = (videoUrl) => {
    try {
      const url = new URL(videoUrl);
      const videoId = url.searchParams.get('v') || url.pathname.split('/').pop();
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg.jpeg')" }}>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">🎓 Educational Videos</h1>
          <Link to="/create" className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition-all">+ Add Video</Link>
        </div>
        {loading && <p className="text-gray-500">Loading videos...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && videos.length === 0 && <p className="text-gray-600">No videos found.</p>}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.id}`}
              className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-video bg-gray-200 flex items-center justify-center text-4xl text-gray-400 group-hover:text-gray-600 transition-colors">
                <img src={getThumbnail(video.video_url)} alt="Thumbnail" className="w-full h-auto" />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 truncate">
                  {video.title || 'Untitled Video'}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{video.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;