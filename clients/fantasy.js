const {transform} = require('node-json-transform');
const YahooFantasy = require('yahoo-fantasy');

const config = require('config');

const tokenCallback = ({access_token, refresh_token}) => {
  console.log('access_token: ' + access_token);
  console.log('refresh_token: ' + refresh_token);
  return Promise.resolve();
};

const yf = new YahooFantasy(
    config.get('yahoo.clientId'),
    config.get('yahoo.clientSecret'),
    tokenCallback, // optional
    'https://djperron.com/webhooks/yahoo/callback/', // optional
);

const auth = (res) => {
  yf.auth(res);
};

const authCallback = (req, cb) => {
  yf.authCallback(req, cb);
};

const leagueDataMap = {
  item: {
    name: 'name',
    num_teams: 'num_teams',
    scoring_type: 'head',
    current_week: 'current_week',
    start_date: 'start_date',
    end_date: 'end_date',
    game_code: 'game_code',
    season: 'season',
    standings: [
      {
        team_id: 'team_id',
        name: 'name',
        division_id: 'division_id',
        waiver_priority: 'waiver_priority',
        number_of_moves: 'number_of_moves',
        number_of_trades: 'number_of_trades',
        manager_name: 'managers.nickname',
        manager_tier: 'managers.felo_tier',
        standings: 'standings',
      },
    ],
    scoreboard: {
      matchups: [
        {
          week: 'week',
          week_start: 'week_start',
          week_end: 'week_end',
          teams: [
            {
              team_id: "team_id",
              points: "points",
              projected_points: "projected_points",
            }
          ]
        },
      ]
    }
  },
};

const getLeagueData = async () => {
  let rawData = await yf.leagues.fetch(
      [config.get('yahoo.leagueKey')],
      ['standings', 'teams', 'scoreboard']);
  console.log(JSON.stringify(rawData, null, 2));
  let leagueData = transform(rawData.pop(), leagueDataMap);
  console.log(JSON.stringify(rawData, null, 2));
  return leagueData;
};

module.exports = {auth, authCallback, getLeagueData};
