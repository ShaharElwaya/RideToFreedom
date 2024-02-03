// Component for displaying picture and text in a box
export const PicAndText = ({ pictureName, name }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={`../${pictureName}.png`} alt={pictureName} style={{ width: '80px', height: '80px' }} />
      <div>{name}</div>
    </div>
  );