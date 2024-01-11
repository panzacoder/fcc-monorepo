import { join, dirname } from 'path'
import assert from 'assert'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-interactions'),
    {
      name: getAbsolutePath('@storybook/addon-react-native-web'),
      options: {
        modulesToTranspile: [
          'react-native',
          'react-native-web',
          'solito',
          'moti',
          'app',
          'react-native-reanimated',
          'nativewind',
          'react-native-css-interop',
          'react-native-gesture-handler',
        ],

        babelPlugins: [
          // 'react-native-reanimated/plugin', // this breaks...
        ],
      },
    },
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config) => {
    assert(config.resolve)
    config.resolve.plugins = [new TsconfigPathsPlugin()]

    // Remove export-order-loader since it doesn't work properly for CommonJS code
    // It currently appends ES code to CommonJS code resulting in a "exports is not defined" error
    // See https://github.com/storybookjs/storybook/issues/25383
    // This might result in the order of stories not corresponding to the order of exports,
    // although from my testing it doesn't seem to be the case and works fine without it
    // TODO: remove this fix once it is fixed in the library
    config.module.rules = config.module.rules.filter(
      (rule) =>
        !rule?.use?.some?.((u) =>
          String(u?.loader)?.includes?.('export-order-loader'),
        ),
    )

    return config
  },
}
export default config
