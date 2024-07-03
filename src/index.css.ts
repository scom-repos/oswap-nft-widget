import { Styles } from '@ijstech/components';
import Assets from './assets';

export const nftStyle = Styles.style({
  minHeight: '600px',
  paddingTop: '1rem',
  $nest: {
    '*': {
      boxSizing: 'border-box',
    },
    '.widget': {
      position: 'relative',
      width: '100%',
    },
    '.i-loading--active': {
      marginTop: '2rem',
      $nest: {
        '.tab-sheet--container': {
          display: 'none !important',
        },
        '.i-loading-spinner': {
          marginTop: '2rem',
        },
      },
    },
    '.current-nft': {
      // position: 'absolute',
      // right: 'calc(1rem - 5px)',
      width: 'fit-content',
      margin: '0 auto 20px',
      display: 'block',
      borderRadius: '12px',
      background: '#252a48',
      border: '2px solid #f15e61',
      padding: '0.35rem 2rem',
      $nest: {
        'i-label': {
          $nest: {
            '*': {
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#fff',
              textTransform: 'uppercase',
            },
          },
        },
      },
    },
    '.nft-card-column': {
      height: 'auto',
      padding: '0 15px',
      marginBottom: '2rem',
    },
    '.custom-card-column': {
      width: 'calc(33% - 30px)',
      minWidth: '300px',
    },
    '.new-card-column': {
      width: 'calc(33% - 30px)',
      minWidth: '320px',
      maxWidth: '400px',
    },
    '.nft-card-stake': {
      height: 'auto',
      padding: '0 15px',
      marginBottom: '2rem',
      width: '450px',
      maxWidth: '100%',
      $nest: {
        '.bg-img': {
          padding: '3rem'
        }
      }
    },
    '.nft-burn-stake': {
      $nest: {
        '.bg-img': {
          padding: '3rem'
        }
      }
    },
    '.card-widget': {
      position: 'relative',
      flex: '1 1 0%',
      borderRadius: '15px',
      background: '#252a48',
      color: '#fff',
      $nest: {
        '.title-icon': {
          position: 'relative',
        },
      }
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
    '.btn-stake': {
      marginTop: '1.5rem',
      width: '100%',
      height: '50px',
      background: 'transparent linear-gradient(90deg, #AF2175 0%, #D4626A 100%) 0% 0% no-repeat padding-box',
      border: 'none',
      padding: '0.375rem 0.5rem',
      marginBottom: '1rem'
    },
    '.text-yellow *': {
      color: '#f7d063',
    },
    'i-icon': {
      display: 'inline-block',
    },
    '.title-box': {
      width: '100%',
      textAlign: 'center',
      position: 'relative'
    },

    '.icon-back': {
      position: 'absolute',
      left: 0,
      top: '5px',
    },
    '.row-line': {
      marginBottom: '20px',
      $nest: {
        'i-icon': {
          marginLeft: '5px'
        }
      }
    },
    '.stake-caption *': {
      fontSize: '1.4rem !important',
      fontWeight: 'bold',
      color: '#f7d063'
    },
    '.line-middle': {
      margin: '20px 0',
      borderTop: '1px solid #f15e61',
    },
    '.section-1': {
      border: '1px solid #fff',
      borderRadius: '12px',
      padding: '0.5rem 1rem',
      opacity: '0.75',
      marginBottom: '20px'
    },
    '.section-2': {
      padding: '5px',
      borderRadius: '12px',
      background: 'transparent linear-gradient(90deg, #D4626A 0%, #AF2175 100%) 0% 0% no-repeat padding-box',
    },
    '.caption-big': {
      fontSize: '1.2rem'
    },
    '.note-burn *': {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#f7d063',
    },
  }
})


export const nftDefaultStyle = Styles.style({
  $nest: {
    '.custom-card-column': {
      width: 'calc(25% - 30px)'
    }
  }
})

export const nftStyle_1100 = Styles.style({
  $nest: {
    '.custom-card-column, .new-card-column': {
      width: 'calc(50% - 30px)'
    }
  }
})

export const nftStyle_767 = Styles.style({
  $nest: {
    '.custom-card-column, .new-card-column': {
      margin: '0 auto 1.5rem'
    }
  }
})

export const nftStyle_480 = Styles.style({
  $nest: {
    '.custom-card-column': {
      width: '100% !important',
      minWidth: 'auto',
      maxWidth: '300px'
    },
    '.new-card-column': {
      width: '100% !important',
      minWidth: 'auto',
      padding: 0
    }
  }
})

export const nftStyle_360 = Styles.style({
  $nest: {
    '.os-slider': {
      $nest: {
        '.wrapper-slider': {
          $nest: {
            '.slider-arrow': {
              width: 20,
              height: 20
            },
            '.slider-arrow:first-child': {
              left: '-20px'
            },
            '.slider-arrow:last-child': {
              right: '-20px'
            }
          }
        }
      }
    }
  }
})

export const listMediaStyles = {
  360: nftStyle_360,
  480: nftStyle_480,
  767: nftStyle_767,
  1100: nftStyle_1100
}