import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


const PostingStatus = ({title, content}) => {
  return (
    <div style={{width: '100px', height: '115px', marginRight: '7px'}}>
      <Card sx={{ 
        border: '1px black solid',
        width: '100%', height: '100%', 
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center'
      }}>
        <CardContent style={{
          display: 'inline', 
          justifyContent: 'center',
          padding: '0px',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {title}</Typography>
          <Typography sx={{ fontSize: 18 }} component="div">
            {content}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostingStatus;