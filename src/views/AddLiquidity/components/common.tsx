import React from 'react'
import { Currency, Fraction, Percent, TokenAmount } from '@orbitalswap/sdk'
import { Text, useTooltip, TooltipText, Box, Flex, Svg, SvgProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import { Field } from 'state/burn/actions'
import { DoubleCurrencyLogo, CurrencyLogo } from 'components/Logo'
import { GreyCard } from 'components/Card'
import { getLPSymbol } from 'utils/getLpSymbol'

const Dot = styled(Box)<{ scale?: 'sm' | 'md' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`


const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Text fontSize="12px" textTransform="uppercase" bold color="secondary">
      {children}
    </Text>
  )
}

export const PairDistribution = ({
  title,
  percent,
  currencyA,
  currencyB,
  currencyAValue,
  currencyBValue,
  tooltipTargetRef,
}: {
  title: React.ReactNode
  percent?: number
  currencyA?: Currency
  currencyB?: Currency
  currencyAValue?: string
  currencyBValue?: string
  tooltipTargetRef?: any
}) => {
  return (
    <AutoColumn gap="8px">
      <Subtitle>{title}</Subtitle>
      <Flex>
        {typeof percent !== 'undefined' && (
          <div ref={tooltipTargetRef}>
            <CircleSvg percent={percent} mr="34px" />
          </div>
        )}
        <AutoColumn style={{ width: '100%' }}>
          {currencyA && (
            <RowBetween>
              <AutoRow gap="4px">
                <Dot bg="primary" />
                <CurrencyLogo currency={currencyA} />
                <Text>{currencyA?.symbol}</Text>
              </AutoRow>
              <Text>{currencyAValue}</Text>
            </RowBetween>
          )}

          {currencyB && (
            <RowBetween>
              <AutoRow gap="4px">
                <Dot bg="secondary" />
                <CurrencyLogo currency={currencyB} />
                <Text>{currencyB?.symbol}</Text>
              </AutoRow>
              <Text>{currencyBValue}</Text>
            </RowBetween>
          )}
        </AutoColumn>
      </Flex>
    </AutoColumn>
  )
}

interface AddLiquidityModalHeaderProps {
  currencies: { [field in Field]?: Currency }
  poolTokenPercentage?: Percent
  liquidityMinted: TokenAmount
  price: Fraction
  allowedSlippage: number
  children: React.ReactNode
  noLiquidity?: boolean
}

export const AddLiquidityModalHeader = ({
  currencies,
  poolTokenPercentage,
  liquidityMinted,
  price,
  allowedSlippage,
  noLiquidity,
  children,
}: AddLiquidityModalHeaderProps) => {
  const { t } = useTranslation()
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
      slippage: allowedSlippage / 100,
    }),
    { placement: 'auto' },
  )

  return (
    <AutoColumn gap="24px">
      <AutoColumn gap="8px">
        <Subtitle>{t('You will receive')}</Subtitle>
        <GreyCard>
          <RowBetween>
            <AutoRow gap="4px">
              <DoubleCurrencyLogo
                currency0={currencies[Field.CURRENCY_A]}
                currency1={currencies[Field.CURRENCY_B]}
                size={24}
              />
              <Text color="textSubtle">
                {currencies[Field.CURRENCY_A]?.symbol &&
                  currencies[Field.CURRENCY_B]?.symbol &&
                  getLPSymbol(currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol)}
              </Text>
            </AutoRow>
            <Text ml="8px">{liquidityMinted?.toSignificant(6)}</Text>
          </RowBetween>
        </GreyCard>
      </AutoColumn>
      <RowBetween>
        <Subtitle>{t('Your pool share')}</Subtitle>
        <Text>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Text>
      </RowBetween>
      <AutoColumn gap="8px">{children}</AutoColumn>
      <AutoColumn>
        <RowBetween>
          <Subtitle>{t('Rates')}</Subtitle>
          <Text>
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </Text>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
          <Text>
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </Text>
        </RowBetween>
      </AutoColumn>
      {!noLiquidity && (
        <RowBetween>
          <Subtitle>{t('Slippage Tolerance')}</Subtitle>
          <TooltipText ref={targetRef}>{allowedSlippage / 100}%</TooltipText>
          {tooltipVisible && tooltip}
        </RowBetween>
      )}
    </AutoColumn>
  )
}
