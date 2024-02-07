import { join, dirname } from 'path'
import type { StorybookConfig } from '@storybook/nextjs'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const projectRoot = join(__dirname, '../../..')

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: '../next.config.js',
      builder: {
        useSWC: true
      }
    }
  },
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/app/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../packages/app/**/*.mdx'
  ],
  docs: {
    autodocs: true
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    {
      name: getAbsolutePath('@storybook/addon-react-native-web'),
      options: {
        projectRoot,
        modulesToTranspile: [
          '@expo/vector-icons',
          'app',
          'expo',
          'moti',
          'nativewind',
          'react-native',
          'react-native-css-interop',
          'react-native-gesture-handler',
          'react-native-reanimated',
          'react-native-vector-icons',
          'react-native-web',
          'solito'
        ],
        babelPlugins: [
          'react-native-reanimated/plugin',
          'babel-plugin-expo-vector-icon-storybook',
          [
            '@babel/plugin-transform-react-jsx',
            {
              runtime: 'automatic',
              importSource: 'nativewind'
            }
          ]
        ]
      }
    }
  ],
  webpackFinal: async (config: any) => {
    // Remove export-order-loader since it doesn't work properly for CommonJS code
    // It currently appends ES code to CommonJS code resulting in a "exports is not defined" error
    // See https://github.com/storybookjs/storybook/issues/25383
    // This might result in the order of stories not corresponding to the order of exports,
    // although from my testing it doesn't seem to be the case and works fine without it
    // TODO: remove this fix once it is fixed in the library
    config.module.rules = config.module.rules.filter(
      (rule: any) =>
        !rule?.use?.some?.((u: any) =>
          String(u?.loader)?.includes?.('export-order-loader')
        )
    )

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web'
    }
    // config.module.rules.push({
    //   test: /\.ttf$/,
    //   type: 'asset/resource',
    //   loader: 'file-loader',
    //   include: getAbsolutePath('@expo/vector-icons')
    // })

    return config
  }
}
export default config
