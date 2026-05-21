
/**
 * Typography used in theme
 * @param {JsonObject} typography, theme customization object
 */

const Typography = (fontFamily, increment) => {

  return{
      fontFamily: fontFamily,
      h1: {
        fontWeight: 600,
        fontSize: `${34 + increment}px`,
        lineHeight: 1.5,
        '@media (max-width: 1200px), (max-height: 600px)':{
          fontSize: `${32 + increment}px`,
        },
        '@media (max-width: 900px)':{
          fontSize: `${28 + increment}px`,
        },
        '@media (max-width: 600px)':{
          fontSize: `${24 + increment}px`,
        },
        '@media (max-width: 300px)':{
          fontSize: `${20 + increment}px`,
        }
      },
      h2: {
        fontWeight: 600,
        fontSize: `${32 + increment}px`,
        lineHeight: 1.51,
        '@media (max-width: 1200px), (max-height: 600px) ':{
          fontSize: `${28 + increment}px`,
        },
        '@media (max-width: 900px)':{
          fontSize: `${24 + increment}px`,
        },
        '@media (max-width: 600px)':{
          fontSize: `${22 + increment}px`,
        },
        '@media (max-width: 300px)':{
          fontSize: `${18 + increment}px`,
        }
      },
      h3: {
        fontWeight: 600,
        fontSize: `${28 + increment}px`,
        lineHeight: 1.52,
        '@media (max-width: 1200px), (max-height: 600px)':{
          fontSize: `${24 + increment}px`,
        },
        '@media (max-width: 900px)':{
          fontSize: `${22 + increment}px`,
        },
        '@media (max-width: 600px)':{
          fontSize: `${18 + increment}px`,
        },
        '@media (max-width: 320px)':{
          fontSize: `${16 + increment}px`,
        }
      },
      h4: {
        fontWeight: 600,
        fontSize: `${24 + increment}px`,
        lineHeight: 1.53,
        '@media (max-width: 1200px), (max-height: 600px)':{
          fontSize: `${22 + increment}px`,
        },
        '@media (max-width: 900px)':{
          fontSize: `${18 + increment}px`,
        },
        '@media (max-width: 600px)':{
          fontSize: `${16 + increment}px`,
        },
        '@media (max-width: 320px)':{
          fontSize: `${14 + increment}px`,
        }
      },
      h5: {
        fontWeight: 600,
        fontSize: `${22 + increment}px`,
        lineHeight: 1.54,
        '@media (max-width: 1200px), (max-height: 600px)':{
          fontSize: `${18 + increment}px`,
        },
        '@media (max-width: 900px)':{
          fontSize: `${16 + increment}px`,
        },
        '@media (max-width: 600px)':{
          fontSize: `${14 + increment}px`,
        },
        '@media (max-width: 320px)':{
          fontSize: `${12 + increment}px`,
        }
      },
      h6: {
        fontWeight: 600,
        fontSize: `${18 + increment}px`,
        lineHeight: 1.6,
        '@media (max-width: 1200px), (max-height: 600px)':{
          fontSize: `${16 + increment}px`,
        },
        '@media (max-width: 900px)':{
          fontSize: `${15 + increment}px`,
        },
        '@media (max-width: 600px)':{
          fontSize: `${14 + increment}px`,
        },
        '@media (max-width: 320px)':{
          fontSize: `${13 + increment}px`,
        }
      },
      caption: {
        fontWeight: 400,
        fontSize: `${12 + increment}px`,
        lineHeight: 1.66
      },
      body1: {
        fontSize: `${16 + increment}px`,
        lineHeight: 1.57,
        '@media (max-width: 1200px), (max-height: 600px)':{
          fontSize: `${14 + increment}px`,
        },
        '@media (max-width: 900px)':{
          fontSize: `${12 + increment}px`,
        },
        '@media (max-width: 600px)':{
          fontSize: `${11 + increment}px`,
        },
        '@media (max-width: 320px)':{
          fontSize: `${10 + increment}px`,
        }
      },
      body2: {
        fontSize: `${12 + increment}px`,
        lineHeight: 1.66
      },
      subtitle1: {
        fontSize: `${14 + increment}px`,
        fontWeight: 600,
        lineHeight: 1.57
      },
      subtitle2: {
        fontSize: `${12 + increment}px`,
        fontWeight: 600,
        lineHeight: 1.66
      },
      overline: {
        lineHeight: 1.66
      },
      button: {
        textTransform: 'capitalize'
      }
      
    }
  };
  
  export default Typography;