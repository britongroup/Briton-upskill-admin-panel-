import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, IconButton, CircularProgress } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    contentParagraph1: '',
    contentParagraph2: '',
    courseModules: [{ heading: '', paragraph: [''] }], // Updated to include paragraph array
    content: [],
    image: null

    // keyBenefits: []
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [loading, setLoading] = useState(false); // 🔥 Add this


  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_URL;

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file)); // This is for showing the preview.
      setImageName(file.name);
      setFormData((prev) => ({ ...prev, image: file })); // Set the image file in formData.
    }
  };

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
      [section]: [...prev[section], { heading: '', paragraph: [''] }]
    }));
  };

  const removeField = (section, index) => {
    setFormData((prev) => {
      const updatedSection = prev[section].filter((_, i) => i !== index);
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);

    // Convert content array into a proper JSON string
    data.append('content', JSON.stringify(formData.content.map((item) => item.text)));
    console.log('formdata image-->', formData.image);
    if (formData.image) {
      data.append('image', formData.image);
    }

    console.log('data--->', data);
    try {
      const response = await axios.post(`${server}/api/blogs/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Blog created successfully:', response.data);
      toast('Blog Created Successfully!');

      setFormData({
        title: '',
        content: [], // Reset content properly
        image: null
      });
      setImage(null);
      setImageName('');
    } catch (error) {
      console.error('Error Creating Blog:', error);
    }
    finally {
    setLoading(false); // 🔥 Stop loading
  }
  };

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-8">Create Blog</h2>

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

        {/* blog */}
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
                  onChange={(e) => handleChange(e, 'content', index)}
                  className="mb-6 w-full"
                />
                <IconButton onClick={() => removeField('content', index)} color="error">
                  <RemoveCircle />
                </IconButton>
              </div>
              {/* <TextField
                label={`Key Benefit ${index + 1} Description`}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                name="paragraph"
                value={keyBenefit.paragraph}
                onChange={(e) => handleChange(e, 'content', index)}
                className="mb-6 w-full"
              /> */}
            </div>
          ))}
          <Button variant="outlined" color="primary" startIcon={<AddCircle />} onClick={() => addField('content')} className="mb-6">
            Add Content
          </Button>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Image</h2>
        <div className="flex items-center gap-6">
          {/* Image Preview */}
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {image ? (
              <img src={image} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>

          {/* Form Fields */}
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

        {/* Submit Button */}
        {/* <Button onClick={handleSubmit} fullWidth className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
          Create Blog
        </Button> */}
        <Button
  onClick={handleSubmit}
  fullWidth
  disabled={loading} // 🔥 Disable button when loading
  className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
>
  {loading ? <CircularProgress size={24} color="inherit" /> : "Create Blog"}
</Button>

      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Ensures the white background
      />
    </div>
  );
};

export default CreateBlog;
