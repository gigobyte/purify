module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: { fonts: ['Titillium Web'] },
    },
  ],
  pathPrefix: '/purify',
}
