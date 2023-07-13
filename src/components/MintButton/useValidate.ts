import {
  useContract,
  useActiveClaimCondition,
  useUnclaimedNFTSupply,
} from '@thirdweb-dev/react'

import { constants } from 'ethers'

type Validation = {
  valid: boolean
  message: string
  isValidating: boolean
}

export const useValidate = (address: string): Validation => {
  const { contract } = useContract(address)
  const { data: claimConditions, isLoading } = useActiveClaimCondition(contract)
  const { data: unclaimedSupply, isLoading: isLoadingUnclaimedSupply } =
    useUnclaimedNFTSupply(contract)

  const soldOut = unclaimedSupply?.lte(constants.Zero) || true
  const startTime = claimConditions?.startTime
  const now = Date.now()

  const hasStarted = startTime ? new Date(startTime).getTime() < now : false

  const message = soldOut
    ? 'All NFTs have been claimed'
    : !hasStarted
    ? 'Minting has not started'
    : ''

  return {
    valid: !soldOut && hasStarted,
    message: message,
    isValidating: isLoading || isLoadingUnclaimedSupply,
  }
}
