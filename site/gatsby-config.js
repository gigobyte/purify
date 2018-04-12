module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {resolve: 'gatsby-plugin-google-fonts', options: { fonts: ['Titillium Web'] }}
  ],
  pathPrefix: `/pure`
}
