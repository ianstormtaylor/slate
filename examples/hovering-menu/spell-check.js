import request from 'superagent-bluebird-promise';

const SPELL_CHECK_SERVICE = 'https://languagetool.askwonder.com/v2/check';
const SPELL_CHECK_LANGUAGE = 'en-US';

export async function requestSpellCheck(text) {
  const { body: { matches } } = await request.post(SPELL_CHECK_SERVICE)
  .type('form')
  .send({
    text,
    language: SPELL_CHECK_LANGUAGE,
  });

  return matches;
}
