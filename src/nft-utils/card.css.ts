import { Styles } from '@ijstech/components'
import Assets from '../assets';
const Theme = Styles.Theme.ThemeVars;

export const cardStyle = Styles.style({
  $nest: {
    '.available-box': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0.5rem 0.75rem',
      marginBottom: '1rem',

      $nest: {
        '.label': {
          marginRight: '0.5rem',

          $nest: {
            '*': {
              color: Theme.colors.primary.main,
              fontSize: '1rem',
            },
          },
        },

        '.box': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '25px',
          height: '35px',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',

          $nest: {
            '&.box-left': {
              marginRight: '0.5rem',
              backgroundImage: `url(${Assets.fullPath('img/nft/LeftBox.svg')})`
            },

            '&.box-right': {
              backgroundImage: `url(${Assets.fullPath('img/nft/RightBox.svg')})`
            },
          },
        },
      },
    },

    '.os-slider': {
      position: 'relative',
      margin: '25px auto',
      width: 'calc(90% - 50px)',
      minWidth: '200px',
      $nest: {
        '.wrapper-slider': {
          $nest: {
            '.slider-arrow:first-child': {
              left: '-30px'
            },
            '.slider-arrow:last-child': {
              right: '-30px'
            }
          }
        },
        '.slider-arrow': {
          position: 'absolute'
        }
      }
    },
    '.troll-img': {
      position: 'relative',
      margin: '25px auto',
      width: 'calc(85% - 50px)',
      minWidth: '200px',

      $nest: {
        'i-image': {
          $nest: {
            img: {
              width: '100%',
            },
          },
        },
        '.coffin': {
          top: '-50px',
          left: '-50px',
        },
        '.death': {
          filter: 'grayscale(100%)',
          $nest: {
            '&:hover': {
              filter: 'inherit',
            }
          },
        },
        'i-label': {
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          top: '81.5%',
          padding: '0 25%',
          fontWeight: 700,
          letterSpacing: 0,
          color: '#6f1018',
          textAlign: 'center',
          width: '100%',
          height: '40px',
          textTransform: 'uppercase',
        },
        'i-label *': {
          color: '#6f1018',
        },
        '.background img': {
          padding: '20px 12px 0',
        },
        '.frame': {
          height: '100%',
          left: '-2px',
        },
      },
    },
    '.section': {
      padding: '0 0.75rem'
    },
    '.row-item': {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '0.35rem 0',

      $nest: {
        '.title-icon': {
          position: 'relative',
        },

        'i-label': {
          $nest: {
            '*': {
              fontSize: '.875rem',
            },
          },
        },

        '.title-icon i-icon': {
          position: 'absolute',
          top: '50%',
          right: '-20px',
          transform: 'translateY(-50%)',
          display: 'inline-block',
          width: '14px',
          height: '14px',
        },

        '.value': {
          fontWeight: 700,
        },
      },
    },
  },
})
