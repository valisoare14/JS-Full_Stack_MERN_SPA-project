/** @type {import('tailwindcss').Config} */

//purge - specifica fisierele in care sa se caute calsele tailwinf utilizate pentru includerea on
//fisierul index.css(clasele talwind neutilizate nu vor fii incluse, imbunatatinad performanta)
module.exports = {
    purge: [
      './src/**/*.{js,jsx,ts,tsx}', // This will match any JavaScript/TypeScript files in the src folder
      './public/index.html',         // This includes the public index.html file
      // Include any other directories where you might use Tailwind CSS classes
    ],
    content: [],
    theme: {
      extend: {
        inset:{
          '6':'1.5rem',
          '7.5':'1.875',
          '16.4':'4.1rem',
          '4/5':"20%"
        },
        width:{
          '10':'2.5rem',
          '15':'3.75rem',
          '45':'11.25rem',
          '55':'13.75rem',
          '3.5':'0.7rem',
          '6':'1.5rem',
          '9/10':"90%",
          '64':"16rem",
          '72':'18rem',
          '96':'30rem',
          '144':'36rem',
          '168':'42rem',
          '192':'48rem',
          '216':'54rem',
          '240':'60rem',
          '264':'66rem',
          '288':'72rem'
        },
        height:{
          '5':'1.15rem',
          '15':'5rem',
          '16.4':'4.1rem',
          '30':'7.5rem',
          '4':'1rem',
          '10':'2.5rem',
          '64':"16rem",
          '90':'22.5rem',
          '72':'18rem',
          '96':'30rem',
          '144':'36rem',
          '168':'42rem',
          '192':'48rem',
          '216':'54rem',
          '240':'60rem',
          '264':'66rem',
          '288':'72rem'
        },
        margin:{
          '0.5':'0.125rem',
          '15':'4.1rem',
          '30':"7.5rem"
        },
        screens:{
          'xxs':'260px',
          'xs':'400px'
        },
        fontSize:{
          xxs: ['10px', '12px'],
          xxxs: ['8px','10px']
        },
        borderWidth:{
          '1':'0.05rem'
        }
      }
    },
    plugins: [],
  }