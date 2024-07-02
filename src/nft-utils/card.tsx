import {
  Container,
  ControlElement,
  customElements,
  Label,
  Module,
  Panel,
  Image,
  Button,
  IEventBus,
  application,
  CarouselSlider
} from '@ijstech/components'
import { BigNumber } from '@ijstech/eth-wallet';
import Assets from '../assets';
import { EventId } from '../global/index';
import { IDataCard, IDataMyCard, isClientWalletConnected, State } from '../store/index';
import { cardStyle } from './card.css';
import { NftMyCard } from './myCard';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['nft-card']: ControlElement
    }
  }
}

@customElements('nft-card')
export class NftCard extends Module {
  private $eventBus: IEventBus;
  private _cardData: IDataCard;
  private pnlSlots: Panel;
  private stakeAmountText: Label;
  private trollImage: Panel;
  private reward: Label;
  private monthlyReward: Label;
  private flashSales: Label;
  private lbCount: Label;
  private btnHandleStake: Button;
  private carouselSlider: CarouselSlider;
  onStake: () => void;
  onBurn: (item: IDataMyCard) => void;
  private clientEvents: any[] = [];
  private _state: State;

  constructor(state: State, parent?: Container, options?: any) {
    super(parent, options);
    this.state = state;
    this.$eventBus = application.EventBus;
    this.registerEvent();
  }

  onHide() {
    for (let event of this.clientEvents) {
      event.unregister();
    }
    this.clientEvents = [];
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

  private capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private async renderCard() {
    const value = this.cardData;
    this.trollImage.clearInnerHTML();
    // this.pnlSlots.clearInnerHTML();
    // this.pnlSlots.append(<i-label caption="Available Slots" class="label"></i-label>);
    // let slotText: string = new BigNumber(value.slot).lt(10) ? ('0' + value.slot) : value.slot;
    // let slotArr = slotText.split('');
    // for (let text of slotArr) {
    //   this.pnlSlots.append(<i-label caption={text} class="box box-left"></i-label>);
    // }
    const count = value.userNFTs?.length || 0;
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
      const img1 = new Image();
      const img2 = new Image();
      const img3 = new Image();
      const img4 = new Image();
      const img5 = new Image();
      const trollText = new Label();
      const trollType = this.capitalizeFirstLetter(value.tier);
      img1.url = Assets.fullPath(`img/nft/${trollType}-Troll-01-Skin.svg`);
      img2.url = Assets.fullPath(`img/nft/${trollType}-Troll-01-Horn.svg`);
      img3.url = Assets.fullPath(`img/nft/${trollType}-Troll-01-Mouth.svg`);
      img4.url = Assets.fullPath(`img/nft/${trollType}-Troll-01-Shirt.svg`);
      img5.url = Assets.fullPath(`img/nft/${trollType}-Troll-01-Eyes.svg`);
      this.trollImage.appendChild(<i-image url={Assets.fullPath('img/nft/Background.svg')} class="background" />);
      this.trollImage.appendChild(<i-image url={Assets.fullPath('img/nft/Frame.svg')} class="frame" />);
      this.trollImage.appendChild(img1);
      this.trollImage.appendChild(img2);
      this.trollImage.appendChild(img3);
      this.trollImage.appendChild(img4);
      this.trollImage.appendChild(img5);
      this.trollImage.appendChild(trollText);
      trollText.caption = `${trollType} BABY TROLL`;
    }

    this.updateBtn();
  }

  private updateBtn() {
    if (!isClientWalletConnected()) {
      this.btnHandleStake.caption = 'No Wallet';
      this.btnHandleStake.enabled = false;
    } else {
      const isSoldedOut = this.cardData?.slot == '0';
      this.btnHandleStake.caption = isSoldedOut ? 'Sold Out' : 'Stake';
      this.btnHandleStake.enabled = !isSoldedOut;
    }
  }

  registerEvent() {
    this.clientEvents.push(this.$eventBus.register(this, EventId.IsWalletConnected, this.updateBtn));
    this.clientEvents.push(this.$eventBus.register(this, EventId.IsWalletDisconnected, this.updateBtn));
  }

  handleStake() {
    this.onStake();
  }

  openLink() {
    const chainId = this.state.getChainId();
    this.state.viewOnExplorerByAddress(chainId, this._cardData.address);
  }

  async init() {
    this.classList.add(cardStyle);
    super.init();
  }

  render() {
    return (
      <i-panel class="card-widget">
        <i-panel class="bg-img">
          {/* <i-panel id="pnlSlots" class="available-box">
            <i-label caption="Available Slots" class="label"></i-label>
            <i-label id="caption1" caption="0" class="box box-left"></i-label>
            <i-label id="caption2" caption="0" class="box box-right"></i-label>
          </i-panel> */}

          <i-panel id="trollImage" />
          <i-panel class="section">
            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Stake Amount"></i-label>
              </i-panel>
              <i-label id="stakeAmountText" caption="50,000 OSWAP" class="value"></i-label>
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Rewards Boost"></i-label>
                <i-icon
                  name="question-circle"
                  fill="#fff"
                  tooltip={{
                    content: 'The Reward Boost is only applicable to OSWAP staking rewards.',
                    placement: 'right'
                  }}
                ></i-icon>
              </i-panel>
              <i-label id="reward" caption="5%" class="value"></i-label>
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Monthly Reward"></i-label>
                <i-icon
                  name="question-circle"
                  fill="#fff"
                  tooltip={{ content: 'The Monthly Reward will be distributed at the end of each month.', placement: 'right' }}
                ></i-icon>
              </i-panel>
              <i-label id="monthlyReward" caption="5%" class="value"></i-label>
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Flash Sales Inclusion"></i-label>
              </i-panel>
              <i-label id="flashSales" caption="Periodic" class="value"></i-label>
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Owned"></i-label>
              </i-panel>
              <i-label id="lbCount" caption="0" class="value"></i-label>
            </i-panel>

            <i-button id="btnHandleStake" height="auto" class="btn-stake btn-os" caption="Stake" onClick={this.handleStake} />

            <i-hstack horizontalAlignment="start" verticalAlignment="center" margin={{ top: '0.25rem', bottom: '0.25rem' }}>
              <i-label caption="View contract" onClick={this.openLink} margin={{ right: '0.5rem' }} class="text-yellow pointer" />
              <i-icon name="external-link-alt" onClick={this.openLink} fill="#f7d063" width={15} height={15} class="text-yellow pointer" />
            </i-hstack>
          </i-panel>

        </i-panel>
      </i-panel>
    )
  }
}
