import { Styles } from '@ijstech/components';
import Assets from './assets';
const Theme = Styles.Theme.ThemeVars;

export const nftStyle = Styles.style({
  flex: '1 1 0% !important',
  height: '100%',
  minHeight: '100vh',
  overflow: 'auto',
  overflowX: 'hidden',
  paddingTop: '1rem',
  $nest: {
    'i-combo-box': {
      color: '#fff',
      $nest: {
        '.item-list': {
          background: '#1f1e4f',
          $nest: {
            'i-combo-box > .item-list > ul > li.matched, i-combo-box > .item-list > ul > li:hover': {
              background: '#252a48'
            },
            'ul': {
              overflow: 'unset',
              maxHeight: 'fit-content',
              fontSize: '14px',
              textAlign: 'left'
            }
          }
        },
        'input': {
          width: '100%',
          color: '#fff',
          background: '#1f1e4f',
          border: 'none',
          paddingLeft: '15px'
        },
        'input:focus-visible': {
          outline: 'none'
        },
        '.icon-btn': {
          display: 'flex',
          alignItems: 'center',
          background: '#1f1e4f',
          color: '#fff',
          width: 'auto !important',
          borderRadius: '0 12px 12px 0'
        },
        '.selection': {
          background: '#1f1e4f',
          padding: 0,
          borderRadius: '12px 0 0 12px',
          border: 'none'
        }
      }
    },
    'i-pagination': {
      marginBottom: '1.5rem',
      $nest: {
        '.paginate_button': {
          backgroundColor: 'rgb(12, 18, 52)',
          border: '1px solid #f15e61',
          color: '#f7d064',
          padding: '4px 16px',
          $nest: {
            '&.active': {
              backgroundColor: '#d05271',
              border: '1px solid #d05271',
              color: '#fff',
            },
          },
        },
      },
    },
    '#myRewardTable': {
      $nest: {
        'thead tr th': {
          borderTop: '1px solid #f7d063',
          borderBottom: '1px solid #f7d063',
        },
        'thead tr th:first-child': {
          borderLeft: '1px solid #f7d063',
          borderRadius: '12px 0 0 0',
        },
        'thead tr th:last-child': {
          borderRadius: '0 12px 0 0',
          borderRight: '1px solid #f7d063',
        },
        'tbody tr td': {
          borderBottom: '1px solid #f7d063',
          textAlign: 'center'
        },
        'tbody tr td:first-child': {
          borderLeft: '1px solid #f7d063',
        },
        'tbody tr td:last-child': {
          borderRight: '1px solid #f7d063',
        },
        'tbody tr:last-child td:first-child': {
          borderRadius: ' 0 0 0 12px',
        },
        'tbody tr:last-child td:last-child': {
          borderRadius: ' 0 0 12px 0',
        }
      }
    },
    '*': {
      boxSizing: 'border-box',
    },
    '.widget': {
      position: 'relative',
      width: '100%',
    },
    '.btn-claim': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.35rem 0.5rem',
      fontWeight: 'bold',
      $nest: {
        'i-icon': {
          marginRight: '0.25rem',
        },
      },
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
    '.box-description': {
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.2)',
      margin: '1rem 0 0',
      padding: '1rem 1.5rem',
      borderRadius: '12px',

      $nest: {
        'i-label': {
          $nest: {
            '*': {
              fontSize: '1rem',
            },
          },
        },
      },
    },
    '.current-nft': {
      position: 'absolute',
      right: 'calc(1rem - 5px)',
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
          color: ' #6f1018',
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
      fontSize: '1.4rem',
      fontWeight: 'bold',
      color: '#f7d063',
    },
    '.render-mobile--item': {
      display: 'none',
      marginTop: '1rem',
    }
  }
})

export const tabStyle = Styles.style({
  $nest: {
    '.tabs-nav-wrap': {
      marginBottom: '2rem',
      background: 'transparent',
      $nest: {
        '.tabs-nav': {
          gap: '0 !important',
          border: 'none',
          flexWrap: 'wrap',
          width: '100%',
          maxWidth: 'calc(100% - 175px)',
        },
        'i-tab': {
          minWidth: '33.33%',
          // background: Theme.background.default,
          padding: '9px 16px',
          display: 'flex',
          alignSelf: 'center',
          cursor: 'pointer',
          position: 'relative',
          background: "transparent",
          marginBottom: '0px',
          border: "none",
          borderBottom: '4px solid transparent',
          $nest: {
            'i-label *': {
              fontSize: '1.3125rem',
              fontWeight: 700,
              marginLeft: '7px',
              display: 'inline-block'
            },
            '&::after': {
              position: 'absolute',
              bottom: '-1px',
              width: '100%',
              borderBottomColor: Theme.colors.warning.main + ' !important',
              borderBottomWidth: '4px !important',
              left: 0,
            },
            '.tab-item': {
              fontFamily: Theme.typography.fontFamily,
            },
          },
        },
        'i-tab:not(.disabled).active': {
          // background: Theme.background.gradient
          backgroundColor: 'transparent',
          borderBottom: '4px solid #e2c05e',
        },
        '.tab-item': {
          margin: 'auto'
        }
      }
    }
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
    },
    '.mobile-hidden': {
      display: 'none !important'
    },
    '.render-mobile--item': {
      display: 'flex',
      $nest: {
        'i-label': {
          whiteSpace: 'nowrap',
          textAlign: 'left',
          lineHeight: '1rem'
        },
        'i-label *': {
          fontSize: '0.8rem'
        },
        '.custom-min--h': {
          minHeight: '32px'
        }
      }
    }
  }
})

export const nftStyle_525 = Styles.style({
  $nest: {
    '.current-nft': {
      position: 'relative',
      maxWidth: '12.5rem',
      right: 0,
      top: 0,
      margin: '1rem auto',
      textAlign: 'center'
    },
    '.nft-tabs .tabs-nav': {
      maxWidth: '100%',
      $nest: {
        'i-tab': {
          width: 'max-content',
          minWidth: '12rem'
        }
      }
    },
    '.troll-img': {
      width: '160px',
      height: '220px',
      $nest: {
        'i-label': {
          height: '30px'
        },
        'i-label *': {
          fontSize: '.75rem',
          lineHeight: '1rem'
        }
      }
    },
    '.note-burn *': {
      fontSize: '1.125rem'
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

export const nftStyle_375 = Styles.style({
  $nest: {
    '#myRewardTable .i-table-body>tr>td': {
      padding: '1rem 0.5rem'
    }
  }
})

export const listMediaStyles = {
  375: nftStyle_375,
  480: nftStyle_480,
  525: nftStyle_525,
  767: nftStyle_767,
  1100: nftStyle_1100
}