module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-typescript',
    {resolve: 'gatsby-plugin-google-fonts', options: { fonts: ['Titillium Web'] }},
    {resolve: 'gatsby-plugin-favicon', options: { logo: './images/favicon.png', injectHTML: true, icons: { android: true, appleIcon: true, appleStartup: true } }}
  ],
  pathPrefix: '/pure'
}
