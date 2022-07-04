import translateOrigin from 'translate';

/**
 *
 * @param {string} text text
 * @returns {Promise<string>} translated text
 */
const translate = async (text) => {
  return await translateOrigin(text, { from: 'en', to: 'zh' });
};

export { translate };
