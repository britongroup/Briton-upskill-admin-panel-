import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Typography from '@mui/material/Typography';

const EditService = () => {
  const [formData, setFormData] = useState({
    title: '',
    contentParagraph1: '',
    contentParagraph2: '',
    Cardimage: null,
    brochure: null,

    comprehensiveservices: [{ heading: '', paragraph: [''] }],
    whyChoose: [{ heading: '', paragraph: '' }],
    ourProcess: [{ heading: '', paragraph: '' }],
    image: null
  });

  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  const [Cardimage, setCardimage] = useState(null);
  const [CardimageName, setCardimageName] = useState('');
  const [CardimageUrl, setCardimageUrl] = useState('');
  const [brochureUrl, setbrochureUrl] = useState('');

  const navigate = useNavigate();
  const server = process.env.REACT_APP_API_URL;

  const { id } = useParams(); // Getting serviceId from URL params

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
    if (CardimageUrl) {
      setCardimage(CardimageUrl);
      setCardimageName(getImageNameFromUrl(CardimageUrl)); // Set the image name from the URL
    }
  }, [CardimageUrl]);
  // Fetch the service data when the component mounts
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        console.log('serviceid->', id);
        const response = await axios.get(`${server}/api/services/${id}`);
        const serviceData = response.data?.service;
        setFormData({
          title: serviceData.title,
          contentParagraph1: serviceData.contentPara1,
          contentParagraph2: serviceData.contentPara2,
          comprehensiveservices: serviceData.comprehensiveservices,
          whyChoose: serviceData.whyChoose,
          ourProcess: serviceData.ourProcess,
          brochure: serviceData?.brochure,
          image: null // Don't overwrite the image until it's changed
        });
        setImageUrl(serviceData?.image);
        // setImage(serviceData?.imageUrl || null);
        setImageName(serviceData?.image || '');
        setCardimageUrl(serviceData?.Cardimage);
        setbrochureUrl(serviceData?.brochure);
        console.log('servicedata brochure-->', serviceData?.brochure);
      } catch (error) {
        toast.error('Failed to fetch service data');
        console.error(error);
      }
    };

    fetchServiceData();
  }, [id]);

  // Handle Image Change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // This is for showing the preview.
      setImageName(file.name);
      setFormData((prev) => ({ ...prev, image: file })); // Set the image file in formData.
    }
  };

  // Handle image change
  const handleCardimageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCardimage(URL.createObjectURL(file)); // Show image preview
      setCardimageName(file.name);
      setFormData((prev) => ({ ...prev, Cardimage: file }));
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

    // Attach the image if present and it's changed
    if (formData.image) {
      data.append('image', formData.image); // Attach the image file
    }

    if (formData.Cardimage) {
      data.append('Cardimage', formData.Cardimage);
    }

    if (formData.brochure) {
      data.append('brochure', formData.brochure);
    }

    try {
      const response = await axios.put(`${server}/api/services/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Service updated successfully:', response.data);
      toast('Service updated successfully!');
      //   navigate(`/services/${serviceId}`); // Redirect to the updated service page
    } catch (error) {
      toast.error('Error updating service');
      console.error('Error updating service:', error);
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-8">Edit Service</h2>

      <div className="space-y-6">
        {/* Title */}
        <div>
          {console.log('formadta value-->', formData)}
          <Typography sx={{ marginBottom: ' 0.7rem' }}>Title</Typography>
          <TextField
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

        {/* Image Preview */}
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
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-input-1" />
            <label
              htmlFor="file-input-1"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg cursor-pointer text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              Choose Image
            </label>
          </div>
        </div>

        {/* Upload Card Image */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Upload Card Image</h2>
{/* 
        <div className="flex items-center gap-6">
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
            <input type="file" accept="image/*" onChange={handleCardimageChange} className="hidden" id="file-input-2" />
            <label
              htmlFor="file-input-2"
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
          <div className="flex items-center">
            <input
              type="file"
              id="brochure"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, brochure: file });
                // Generate brochureUrl (assuming it's a URL to the file you want to show)
                const url = URL.createObjectURL(file);
                setbrochureUrl(url); // Assuming you have setBrochureUrl to update the brochureUrl
              }}
              className="mt-2 w-full px-4 py-4 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
           

            {brochureUrl && (
              <button
                className="bg-blue-600 px-8 py-5 flex justify-center items-center text-white mt-1"
                onClick={() => window.open(brochureUrl, '_blank')} // Opens the brochureUrl in a new tab
              >
                View
              </button>
            )}

            {console.log('brochure-->', brochureUrl)}
          </div>
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

        <Button onClick={handleSubmit} fullWidth className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
          Update Service
        </Button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} />
    </div>
  );
};

export default EditService;
