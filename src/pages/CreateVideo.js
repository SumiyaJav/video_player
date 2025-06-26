import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateVideo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://take-home-assessment-423502.uc.r.appspot.com/api/videos', {
        title,
        description,
        video_url: url,
        user_id: 'sumiyajav_sarangerel'
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create video.');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg.jpeg')" }}>
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-semibold">Create New Video</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border" placeholder="Title" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border" placeholder="Description" required />
          <input value={url} onChange={e => setUrl(e.target.value)} className="w-full p-2 border" placeholder="Video URL" required />
          {error && <p className="text-red-600">{error}</p>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CreateVideo;