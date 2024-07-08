import {
  Control,
  ControlElement,
  customElements,
  Label,
  Module,
  Panel,
  Image,
  Icon,
  Container,
  Styles
} from '@ijstech/components';
import { myCardStyle } from './myCard.css';
import { IDataMyCard, nftImagePlaceHolder } from '../store/index';
const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['nft-my-card']: ControlElement;
    }
  }
}


@customElements('nft-my-card')
export class NftMyCard extends Module {
  private _cardData: IDataMyCard;
  private nftImage: Image;
  private stakeAmount: Label;
  private lbNftID: Label;
  // private reward: Label;
  // private monthlyReward: Label;
  // private flashSales: Label;
  private birthday: Label;
  private rarity: Panel;
  onBurn: () => void;
  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  get cardData(): IDataMyCard {
    return this._cardData
  }

  set cardData(value: IDataMyCard) {
    this._cardData = value;
    this.renderCard();
  }

  private async renderStar() {
    let icon = await Icon.create({
      name: 'star',
      width: 20,
      height: 20,
      fill: Theme.text.primary
    });
    this.rarity.appendChild(icon);
  }

  private async renderCard() {
    const value = this.cardData;
    if (!this.lbNftID.isConnected) await this.lbNftID.ready();
    this.lbNftID.caption = `${value.trollNumber || '-'}`;
    if (!this.stakeAmount.isConnected) await this.stakeAmount.ready();
    this.stakeAmount.caption = value.stakeAmountText;
    // if (this.reward) await this.reward.ready();
    // this.reward.caption = value.rewardsBoost;
    // if (this.monthlyReward) await this.monthlyReward.ready();
    // this.monthlyReward.caption = value.monthlyRewardText;
    // if (this.flashSales) await this.flashSales.ready();
    // this.flashSales.caption = value.flashSales;
    if (this.birthday) await this.birthday.ready();
    this.birthday.caption = value.birthday;
    if (this.rarity) {
      for (let i = 0; i < value.rarity; i++) {
        this.renderStar();
      }
    }

    if (this.nftImage) {
      this.nftImage.url = value.image;
    }
  }

  private handleFlipCard(sender: Control, event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('btn-burn') || target.closest('.btn-burn')) {
      this.onBurn();
    } else {
      sender.classList.toggle('active');
    }
  }

  async init() {
    this.classList.add(myCardStyle);
    super.init();
  }

  async render() {
    return (
      <i-panel class="card-section" id="panel1" onClick={(control, e) => this.handleFlipCard(control, e)}>
        <i-panel class="bg-flip">
          <i-panel class="mycard-img">
            <i-image id="nftImage" fallbackUrl={nftImagePlaceHolder} />
          </i-panel>
          <i-vstack verticalAlignment="space-between" class="section-my-card">
          <i-panel margin={{ top: 10 }} class="row-item">
              <i-panel class="title-icon">
                <i-label caption="ID" />
              </i-panel>
              <i-label id="lbNftID" class="value" />
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Birthday" />
              </i-panel>
              <i-label id="birthday" caption="50,000 OSWAP" class="value" />
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Rarity" />
              </i-panel>
              <i-panel id="rarity" />
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Value" />
              </i-panel>
              <i-label id="stakeAmount" caption="50,000 OSWAP" class="value" />
            </i-panel>

            {/* <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Rewards Boost" />
                <i-icon
                  name="question-circle"
                  fill={Theme.text.primary}
                  tooltip={{
                    content: 'The Reward Boost is only applicable to OSWAP staking rewards.',
                    placement: 'right'
                  }}
                />
              </i-panel>
              <i-label id="reward" caption="5%" class="value" />
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Monthly Reward" />
                <i-icon
                  name="question-circle"
                  fill={Theme.text.primary}
                  tooltip={{
                    content: "The Monthly Reward will be distributed at the end of each month.",
                    placement: 'right'
                  }}
                />
              </i-panel>
              <i-label id="monthlyReward" caption="5%" class="value" />
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Flash Sales Inclusion" />
              </i-panel>
              <i-label id="flashSales" caption="Periodic" class="value" />
            </i-panel> */}

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Bridge Transaction Validate" />
              </i-panel>
              <i-label id="bridge" caption="-" class="value" />
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Bridge Fee Earn" />
              </i-panel>
              <i-label id="fee" caption="-" class="value" />
            </i-panel>

            <i-button id="btnHandleBurn" margin={{ bottom: 10, top: 'auto' }} height="auto" class="btn-burn btn-os" caption="Burn" />
          </i-vstack>
        </i-panel>
      </i-panel>
    )
  }
}
