import { Styles } from '@ijstech/components'
import Assets from '../assets';

export const cardStyle = Styles.style({
  $nest: {
    '.display-none': {
      display: 'none'
    },
    '.invisible': {
      opacity: '0 !important'
    },
    '.text-yellow *': {
      color: '#f7d063',
    },
    'i-icon': {
      display: 'inline-block',
    },
    '.btn-stake': {
      marginTop: '1.5rem',
      width: '100%',
      height: '50px',
      border: 'none',
      padding: '0.375rem 0.5rem',
    },
    '.card-widget': {
      position: 'relative',
      flex: '1 1 0%',
      borderRadius: '15px',
      background: '#252a48',
      color: '#fff',
    },

    '.bg-img': {
      width: '100%',
      height: '100%',
      padding: '2rem',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${Assets.fullPath('img/nft/TrollBorder.png')})`
    },
    '.bg-img-collection': {
      width: '100%',
      height: '100%',
      padding: '1rem',
    },
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
              color: '#f15e61',
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
      width: '230px',
      height: '300px',
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
      width: '220px',
      height: '300px',

      $nest: {
        'i-image': {
          position: 'absolute',

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
