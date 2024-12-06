import {
  Container,
  ControlElement,
  customElements,
  Label,
  Module,
  Panel,
  Image,
  Button,
  CarouselSlider,
  Styles
} from '@ijstech/components'
import Assets from '../assets';
import { IDataCard, IDataMyCard, isClientWalletConnected, State } from '../store/index';
import { cardStyle } from './card.css';
import { NftMyCard } from './myCard';
import translations from '../translations.json';
const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['nft-card']: ControlElement
    }
  }
}

@customElements('nft-card')
export class NftCard extends Module {
  private _cardData: IDataCard;
  // private pnlSlots: Panel;
  private stakeAmountText: Label;
  private trollImage: Panel;
  private reward: Label;
  private monthlyReward: Label;
  private flashSales: Label;
  private lbCount: Label;
  private lbViewContract: Label;
  private btnHandleStake: Button;
  private carouselSlider: CarouselSlider;
  onConnectWallet: () => void;
  onStake: () => void;
  onBurn: (item: IDataMyCard) => void;
  private _state: State;

  constructor(state: State, parent?: Container, options?: any) {
    super(parent, options);
    this.state = state;
  }

  get state() {
    return this._state;
  }

  set state(value: State) {
    this._state = value;
  }

  get cardData(): IDataCard {
    return this._cardData;
  }

  set cardData(value: IDataCard) {
    this._cardData = value;
    this.renderCard();
  }

  private async renderCard() {
    const value = this.cardData;
    this.trollImage.clearInnerHTML();
    // this.pnlSlots.clearInnerHTML();
    // this.pnlSlots.append(<i-label caption="Available Slots" class="label" />);
    // let slotText: string = new BigNumber(value.slot).lt(10) ? ('0' + value.slot) : value.slot;
    // let slotArr = slotText.split('');
    // for (let text of slotArr) {
    //   this.pnlSlots.append(<i-label caption={text} class="box box-left" />);
    // }
    const count = value.userNFTs?.length || 0;
    if (this.lbViewContract) this.lbViewContract.caption = value.fullName || '$view_contract';
    if (this.stakeAmountText) this.stakeAmountText.caption = value.stakeAmountText;
    if (this.reward) this.reward.caption = value.rewardsBoost;
    if (this.monthlyReward) this.monthlyReward.caption = value.monthlyReward;
    if (this.flashSales) this.flashSales.caption = value.flashSales;
    if (this.lbCount) this.lbCount.caption = `${count} ${count === 1 ? 'NFT' : 'NFTs'}`;

    if (count) {
      if (!this.carouselSlider) {
        this.carouselSlider = await CarouselSlider.create({
          width: '100%',
          height: '100%',
          overflow: 'inherit',
          minHeight: 200,
          slidesToShow: 1,
          transitionSpeed: 600,
          items: [],
          type: 'arrow'
        });
      }
      this.trollImage.classList.remove('troll-img');
      this.trollImage.classList.add('os-slider');
      this.trollImage.appendChild(this.carouselSlider);
      const items = [];
      for (const nft of value.userNFTs) {
        const pnl = await Panel.create({ padding: { left: 5, right: 5 }, margin: { bottom: 0 } });
        pnl.classList.add('nft-card-column');
        const card = await NftMyCard.create() as NftMyCard;
        pnl.appendChild(card);
        card.onBurn = () => this.onBurn(nft);
        card.cardData = nft;
        items.push(pnl);
      }
      this.carouselSlider.items = items.map((item: any, idx: number) => {
        return {
          name: `NFT ${value.tier} ${idx}`,
          controls: [item]
        }
      });
    } else {
      this.trollImage.classList.add('troll-img');
      this.trollImage.classList.remove('os-slider');
      const img = new Image();
      img.url = Assets.fullPath(`img/nft/${value.tier || 'hungry'}.png`);
      this.trollImage.appendChild(img);
    }

    this.updateBtn();
  }

  private updateBtn() {
    if (!isClientWalletConnected()) {
      this.btnHandleStake.caption = '$connect_wallet';
      this.btnHandleStake.enabled = true;
    } else {
      const isSoldedOut = this.cardData?.slot <= 0;
      this.btnHandleStake.caption = isSoldedOut ? '$sold_out' : '$stake';
      this.btnHandleStake.enabled = !isSoldedOut;
    }
  }

  private handleStake() {
    if (!isClientWalletConnected()) {
      this.onConnectWallet();
    } else {
      this.onStake();
    }
  }

  private openLink() {
    const chainId = this.state.getChainId();
    this.state.viewOnExplorerByAddress(chainId, this._cardData.address);
  }

  async init() {
    this.i18n.init({...translations});
    this.classList.add(cardStyle);
    super.init();
  }

  render() {
    return (
      <i-panel class="card-widget">
        <i-panel class="bg-img">
          <i-hstack
            gap="0.5rem"
            horizontalAlignment="start"
            verticalAlignment="center"
            cursor="pointer"
            width="fit-content"
            margin={{ top: '0.25rem', bottom: '0.5rem' }}
            onClick={this.openLink}
          >
            <i-label id="lbViewContract" caption="$view_contract" font={{ color: Theme.colors.primary.main, transform: 'capitalize', size: '1rem' }} padding={{ left: '0.75rem' }} />
            <i-icon name="external-link-alt" fill={Theme.colors.primary.main} width={16} height={16} />
          </i-hstack>
          {/* <i-panel id="pnlSlots" class="available-box">
            <i-label caption="Available Slots" class="label" />
            <i-label id="caption1" caption="0" class="box box-left" />
            <i-label id="caption2" caption="0" class="box box-right" />
          </i-panel> */}

          <i-panel id="trollImage" />
          <i-panel class="section">
            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="$stake_amount" />
              </i-panel>
              <i-label id="stakeAmountText" caption="50,000 OSWAP" class="value" />
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="$rewards_boost" />
                <i-icon
                  name="question-circle"
                  fill={Theme.text.primary}
                  tooltip={{
                    content: '$the_reward_boost_is_only_applicable_to_oswap_staking_rewards',
                    placement: 'right'
                  }}
                />
              </i-panel>
              <i-label id="reward" caption="5%" class="value" />
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="$monthly_reward" />
                <i-icon
                  name="question-circle"
                  fill={Theme.text.primary}
                  tooltip={{ content: '$the_monthly_reward_will_be_distributed_at_the_end_of_each_month', placement: 'right' }}
                />
              </i-panel>
              <i-label id="monthlyReward" caption="5%" class="value" />
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="$flash_sales_inclusion" />
              </i-panel>
              <i-label id="flashSales" caption="$periodic" class="value" />
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="$owned" />
              </i-panel>
              <i-label id="lbCount" caption="0" class="value" />
            </i-panel>

            <i-button id="btnHandleStake" height="auto" class="btn-stake btn-os" caption="$stake" onClick={this.handleStake} />
          </i-panel>

        </i-panel>
      </i-panel>
    )
  }
}
