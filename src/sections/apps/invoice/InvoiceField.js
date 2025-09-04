import PropTypes from 'prop-types';

// material-ui
// import { TableCell, TextField } from '@mui/material';
import { TableCell, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

// ==============================|| INVOICE - TEXT FIELD ||============================== //

const InvoiceField = ({ onEditItem, cellData,handleCityChange }) => {
  return (
    <TableCell sx={{ '& .MuiFormHelperText-root': { position: 'absolute', bottom: -24, ml: 0 } }}>
    {cellData.type === 'select' ? (
      <FormControl fullWidth>
        <InputLabel id={cellData.id}>{cellData.label}</InputLabel>
        <Select
          labelId={cellData.id}
          id={cellData.id}
          name={cellData.name}
          value={cellData.value}
          onChange={cellData.onChange} 
          error={Boolean(cellData.errors && cellData.touched)}
        >
          {cellData.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ) : (
      <TextField
        type={cellData.type}
        placeholder={cellData.placeholder}
        name={cellData.name}
        id={cellData.id}
        value={cellData.type === 'number' ? (cellData.value > 0 ? cellData.value : '') : cellData.value}
        onChange={onEditItem}
        label={cellData.label}
        error={Boolean(cellData.errors && cellData.touched)}
        inputProps={{
          ...(cellData.type === 'number' && { min: 0 })
        }}
      />
    )}
  </TableCell>
  );
};

InvoiceField.propTypes = {
  onEditItem: PropTypes.func,
  cellData: PropTypes.object,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.number,
  value: PropTypes.string,
  label: PropTypes.string,
  errors: PropTypes.bool,
  touched: PropTypes.bool
};

export default InvoiceField;
