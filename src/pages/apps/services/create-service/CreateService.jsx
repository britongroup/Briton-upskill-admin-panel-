import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, IconButton } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import Typography from '@mui/material/Typography';

const CreateService = () => {
  const [formData, setFormData] = useState({
    title: '',
    contentParagraph1: '',
    contentParagraph2: '',
    Cardimage: null,
    CardimageUrl: null,
    CardimageName: '',
    brochure: null,
    comprehensiveservices: [{ heading: '', paragraph: [''] }],
    whyChoose: [{ heading: '', paragraph: '' }],
    ourProcess: [{ heading: '', paragraph: '' }],
    image: null

    // keyBenefits: []
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [Cardimage, setCardimage] = useState(null);
  const [CardimageName, setCardimageName] = useState('');
  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_URL;

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setImage(URL.createObjectURL(file)); // This is for showing the preview.
  //     setImageName(file.name);
  //     setFormData((prev) => ({ ...prev, image: file })); // Set the image file in formData.
  //   }
  // };

  const handleImageChange = (event, imageType) => {
    const file = event.target.files[0];
    console.log('imageType-->', imageType);

    if (file) {
      console.log('image change--->', imageType);

      switch (imageType) {
        case 'image':
          setImage(URL.createObjectURL(file)); // This is for showing the preview.
          setImageName(file.name);
          setFormData((prev) => ({ ...prev, image: file })); // Set the image file in formData.
          break;

        case 'Cardimage':
          setCardimage(URL.createObjectURL(file)); // For preview of card image.
          setCardimageName(file.name);
          setFormData((prev) => ({ ...prev, Cardimage: file })); // Set the card image file in formData.
          break;
        default:
          break;
      }
    }
  };
  const handleChange = (e, section, index, paragraphIndex = null) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSection = [...prev[section]];

      if (paragraphIndex !== null) {
        updatedSection[index].paragraph[paragraphIndex] = value;
      } else {
        updatedSection[index][name] = value;
      }

      return { ...prev, [section]: updatedSection };
    });
  };

  const addField = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: Array.isArray(prev[section]) ? [...prev[section], { heading: '', paragraph: [''] }] : [{ heading: '', paragraph: [''] }]
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

    // Create FormData for API submission
    const data = new FormData();

    data.append('title', formData.title);
    data.append('contentPara1', formData.contentParagraph1);

    // Ensure courseModules is a JSON string if it's an array
    const ourProcessString = JSON.stringify(formData.ourProcess);
    data.append('ourProcess', ourProcessString);

    // Ensure keyBenefits is a JSON string if it's an array
    const whyChooseString = JSON.stringify(formData.whyChoose);
    data.append('whyChoose', whyChooseString);

    const comprehensiveServicesString = JSON.stringify(formData.comprehensiveservices);
    data.append('comprehensiveservices', comprehensiveServicesString);

    // Attach the image if present
    if (formData.image) {
      data.append('image', formData.image); // Attach the image file
    }
    console.log('formdata image-->', formData.image);
    // console.log('formdata cardimage',formData.Cardimage)

    if (formData.Cardimage) {
      data.append('Cardimage', formData.Cardimage);
    }

    // Attach the brochure if present
    if (formData.brochure) {
      data.append('brochure', formData.brochure); // Attach the brochure file
    }

    try {
      const response = await axios.post(`${server}/api/services/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // console.log('Service created successfully:', response.data);
      toast('Service created successfully!');
      setTimeout(() => {
        navigate('/apps/allservices');
      }, 3000);
      // navigate('/apps/allcourses')
      setFormData({
        title: '',
        contentParagraph1: '',
        brochure: null,

        image: null
      });

      setImage(null);
      setImageName('');
      setCardimage(null);
      setCardimageName('');

      // Handle success (e.g., show a success message, reset form, etc.)
    } catch (error) {
      toast.error('Error adding services');
      console.error('Error creating course:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-8">Create a New Service</h2>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <Typography sx={{ marginBottom: ' 0.7rem' }}>Title</Typography>
          <TextField
            // label="Title"
            variant="outlined"
            fullWidth
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mb-4 w-full"
          />
        </div>

        {/* Content Paragraph 1 */}
        <div>
          <Typography sx={{ marginBottom: ' 0.7rem' }}>Content Paragraph 1</Typography>
          <TextField
            // label="Content Paragraph 1"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="contentParagraph1"
            value={formData.contentParagraph1}
            onChange={(e) => setFormData({ ...formData, contentParagraph1: e.target.value })}
            className="mb-4 w-full"
          />
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
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'image')} className="hidden" id="file-input" />
            <label
              htmlFor="file-input"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Image
            </label>
          </div>
        </div>

        {/* Upload Card Image */}

        {/* Card Image Upload Section */}
        {/* <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Card Image</h2> */}
        {/* <div className="flex items-center gap-6">
          <div className="w-48 h-48 overflow-hidden rounded-lg border-2 border-gray-200 shadow-md flex justify-center items-center bg-gray-100">
            {Cardimage ? (
              <img src={Cardimage} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">No Image Selected</span>
            )}
          </div>

          <div className="flex-1">
            <TextField
              label="Card Image Name"
              variant="outlined"
              value={CardimageName}
              className="mb-4 w-full"
              disabled
              inputProps={{ style: { fontSize: 16 } }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'Cardimage')}
              className="hidden"
              id="file-input-card-image" // unique id for the second file input
            />
            <label
              htmlFor="file-input-card-image"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Card Image
            </label>
          </div>
        </div> */}

        {/* Upload Brochure */}
        {/* <div className="mb-4">
          <label htmlFor="brochure" className="block text-sm font-medium text-gray-700">
            Upload Brochure
          </label>
          <input
            type="file"
            id="brochure"
            onChange={(e) => setFormData({ ...formData, brochure: e.target.files[0] })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formData.brochure && <p className="mt-1 text-sm text-gray-500">{formData.brochure.name}</p>}
        </div> */}
        {/* Why Choose */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Why Choose</h3>
          {formData?.whyChoose?.map((keyBenefit, index) => (
            <div key={index} className="space-y-4 mb-4">
              <Typography sx={{ marginBottom: ' 0.7rem' }}>Why Choose {index + 1}</Typography>
              <div className="flex items-center space-x-4">
                <TextField
                  // label={`Key Benefit ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  name="heading"
                  value={keyBenefit.heading}
                  onChange={(e) => handleChange(e, 'whyChoose', index)}
                  className="mb-2 w-full"
                />
                <IconButton onClick={() => removeField('whyChoose', index)} color="error">
                  <RemoveCircle />
                </IconButton>
              </div>
              <Typography sx={{ marginBottom: ' 0.7rem' }}>Why Choose {index + 1} Description</Typography>
              <TextField
                // label={`Key Benefit ${index + 1} Description`}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                name="paragraph"
                value={keyBenefit.paragraph}
                onChange={(e) => handleChange(e, 'whyChoose', index)}
                className="mb-6 w-full"
              />
            </div>
          ))}
          <Button variant="outlined" color="primary" startIcon={<AddCircle />} onClick={() => addField('whyChoose')} className="mb-6">
            Add New
          </Button>
        </div>

        {/* our Process */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Our Process</h3>
          {formData?.ourProcess?.map((keyBenefit, index) => (
            <div key={index} className="space-y-4 mb-4">
              <Typography sx={{ marginBottom: ' 0.7rem' }}>Our Process {index + 1}</Typography>
              <div className="flex items-center space-x-4">
                <TextField
                  // label={`Key Benefit ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  name="heading"
                  value={keyBenefit.heading}
                  onChange={(e) => handleChange(e, 'ourProcess', index)}
                  className="mb-2 w-full"
                />
                <IconButton onClick={() => removeField('ourProcess', index)} color="error">
                  <RemoveCircle />
                </IconButton>
              </div>
              <Typography sx={{ marginBottom: ' 0.7rem' }}>Our Process {index + 1} Description</Typography>
              <TextField
                // label={`Key Benefit ${index + 1} Description`}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                name="paragraph"
                value={keyBenefit.paragraph}
                onChange={(e) => handleChange(e, 'ourProcess', index)}
                className="mb-6 w-full"
              />
            </div>
          ))}
          <Button variant="outlined" color="primary" startIcon={<AddCircle />} onClick={() => addField('ourProcess')} className="mb-6">
            Add Process
          </Button>
        </div>

        {/* our Comprehensive Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Comprehensive Services</h3>
          {formData?.comprehensiveservices?.map((keyBenefit, index) => (
            <div key={index} className="space-y-4 mb-4">
              <Typography sx={{ marginBottom: ' 0.7rem' }}>Comprehensive Services {index + 1}</Typography>
              <div className="flex items-center space-x-4">
                <TextField
                  // label={`Key Benefit ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  name="heading"
                  value={keyBenefit.heading}
                  onChange={(e) => handleChange(e, 'comprehensiveservices', index)}
                  className="mb-2 w-full"
                />
                <IconButton onClick={() => removeField('comprehensiveservices', index)} color="error">
                  <RemoveCircle />
                </IconButton>
              </div>
              <Typography sx={{ marginBottom: ' 0.7rem' }}>Comprehensive Services {index + 1} Description</Typography>
              <TextField
                // label={`Key Benefit ${index + 1} Description`}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                name="paragraph"
                value={keyBenefit.paragraph}
                onChange={(e) => handleChange(e, 'comprehensiveservices', index)}
                className="mb-6 w-full"
              />
            </div>
          ))}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddCircle />}
            onClick={() => addField('comprehensiveservices')}
            className="mb-6"
          >
            Add Service
          </Button>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} fullWidth className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
          Create Course
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

export default CreateService;
