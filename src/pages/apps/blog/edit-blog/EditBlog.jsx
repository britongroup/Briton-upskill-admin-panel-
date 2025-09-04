import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

const EditBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: [],
    image: null,
    imageName: ''
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  const { id } = useParams(); // To get the blog ID from the URL
  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_URL;

  const getImageNameFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1]; // Get the last part after the last "/"
  };
  useEffect(() => {
    if (imageUrl) {
      setImage(imageUrl);
      setImageName(getImageNameFromUrl(imageUrl)); // Set the image name from the URL
    }
  }, [imageUrl]);
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(`${server}/api/blogs/${id}`);
        const blogData = response.data;

        // Set default values for form data from the fetched blog
        setFormData({
          title: blogData.title,
          content: blogData.content.map((item) => ({ text: item })),
          imageName: blogData.imageName // assuming image name is returned from the API
        });

        // setImage(blogData.image); // If the API returns the image URL
        setImageUrl(blogData?.image);
        // setImage(serviceData?.imageUrl || null);
        setImageName(blogData?.image || '');
      } catch (error) {
        console.error('Error fetching blog data:', error);
        toast.error('Error fetching blog data.');
      }
    };

    fetchBlogData();
  }, [id]);

  const handleChange = (e, field, index) => {
    const { value } = e.target;

    setFormData((prevState) => {
      if (field === 'content') {
        const updatedContent = [...prevState.content];
        updatedContent[index] = { text: value }; // Ensure correct object structure
        return { ...prevState, content: updatedContent };
      }
      return { ...prevState, [field]: value };
    });
  };

  const addField = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], { text: '' }]
    }));
  };

  const removeField = (section, index) => {
    setFormData((prev) => {
      const updatedSection = prev[section].filter((_, i) => i !== index);
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageName(file.name);
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', JSON.stringify(formData.content.map((item) => item.text)));

    // Append the image if a new image is selected
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.put(`${server}/api/blogs/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast('Blog Updated Successfully!');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Error updating the blog.');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-8">Edit Blog</h2>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mb-4 w-full"
          />
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Content</h3>
          {formData.content.map((content, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div className="flex items-center space-x-4">
                <TextField
                  label={`Content Paragraph ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  name="content"
                  value={content.text}
                  onChange={(e) => handleChange(e, 'content', index)}
                  className="mb-6 w-full"
                />
                <IconButton onClick={() => removeField('content', index)} color="error">
                  <RemoveCircle />
                </IconButton>
              </div>
            </div>
          ))}
          <Button variant="outlined" color="primary" startIcon={<AddCircle />} onClick={() => addField('content')} className="mb-6">
            Add Content
          </Button>
        </div>

        {/* Image Upload */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Image</h2>
        <div className="flex items-center gap-6">
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {image ? (
              <img src={image} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>

          <div className="flex-1">
            <TextField
              label="Image Name"
              variant="outlined"
              value={imageName}
              className="mb-4 w-full"
              disabled
              inputProps={{ style: { fontSize: 16 } }}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-input" />
            <label
              htmlFor="file-input"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Image
            </label>
          </div>
        </div>

        <Button onClick={handleSubmit} fullWidth className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
          Update Blog
        </Button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick />
    </div>
  );
};

export default EditBlog;
