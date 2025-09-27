import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, CheckCircle, Upload, Hash, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"
import { useAppMessages } from '@/hooks/useAppMessages'
import { toast } from "@/hooks/use-toast";

interface PaymentMethod {
  name: string;
  logo: string;
  url: string;
  currencies: string[];
}

interface PaymentMethods {
  [key: string]: PaymentMethod;
}

export default function Deposit() {
  const { user } = useAuth();
  const { showMessage } = useAppMessages();
  const [step, setStep] = useState<'select-method' | 'select-currency' | 'get-address' | 'upload-proof'>('select-method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({});
  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [proofType, setProofType] = useState<'file' | 'hash'>('file');

  useEffect(() => {
    // Initialize with major crypto platforms
    setPaymentMethods({
      binance: {
        name: 'Binance',
        logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
        url: 'https://www.binance.com',
        currencies: ['BTC', 'ETH', 'BNB', 'USDT', 'USDC', 'ADA', 'SOL', 'DOT', 'MATIC', 'LINK']
      },
      bybit: {
        name: 'Bybit',
        logo: 'https://static.bybit.com/web/new-header-logo.png',
        url: 'https://www.bybit.com',
        currencies: ['BTC', 'ETH', 'USDT', 'USDC', 'SOL', 'ADA', 'DOGE', 'AVAX', 'XRP', 'DOT']
      },
      cryptocom: {
        name: 'Crypto.com',
        logo: 'https://crypto.com/favicon.ico',
        url: 'https://crypto.com',
        currencies: ['BTC', 'ETH', 'CRO', 'USDT', 'USDC', 'BNB', 'ADA', 'SOL', 'MATIC', 'VET']
      },
      kraken: {
        name: 'Kraken',
        logo: 'https://assets.kraken.com/marketing/web/icons/kraken-logo.svg',
        url: 'https://kraken.com',
        currencies: ['BTC', 'ETH', 'USDT', 'USDC', 'ADA', 'SOL', 'DOT', 'LINK', 'UNI', 'ALGO']
      },
      coinbase: {
        name: 'Coinbase',
        logo: 'https://dynamic-assets.coinbase.com/img/favicon.ico',
        url: 'https://coinbase.com',
        currencies: ['BTC', 'ETH', 'USDC', 'USDT', 'ADA', 'SOL', 'DOGE', 'MATIC', 'LINK', 'UNI']
      },
      kucoin: {
        name: 'KuCoin',
        logo: 'https://assets.kucoin.com/cdn/assets/images/common/kcs_logo.png',
        url: 'https://kucoin.com',
        currencies: ['BTC', 'ETH', 'KCS', 'USDT', 'USDC', 'ADA', 'SOL', 'DOGE', 'TRX', 'VET']
      }
    });
  }, []);

  const generateDepositAddress = async () => {
    if (!selectedMethod || !selectedCurrency) return;

    setLoading(true);
    try {
      const response = await fetch('/api/deposits/wallet-addresses', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        // Find the address for the selected cryptocurrency
        const walletAddress = data.find((addr: any) => addr.symbol === selectedCurrency);
        if (walletAddress) {
          setDepositAddress(walletAddress.address);
          setStep('get-address');
        } else {
          throw new Error(`No wallet address found for ${selectedCurrency}`);
        }
      } else {
        throw new Error(data.message || 'Failed to get wallet address');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get deposit address",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  const openExternalProvider = () => {
    if (paymentMethods[selectedMethod]) {
      window.open(paymentMethods[selectedMethod].url, '_blank');
      setTimeout(() => setStep('upload-proof'), 2000);
    }
  };

  const submitProof = async () => {
    if (!depositAmount || (!proofFile && !transactionHash)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('amount', depositAmount);
      formData.append('currency', selectedCurrency);
      formData.append('symbol', selectedCurrency);
      formData.append('paymentMethod', selectedMethod);

      if (proofType === 'file' && proofFile) {
        formData.append('proof', proofFile);
      } else if (proofType === 'hash' && transactionHash) {
        // Create a text file with the transaction hash
        const hashBlob = new Blob([`Transaction Hash: ${transactionHash}`], { type: 'text/plain' });
        const hashFile = new File([hashBlob], 'transaction_hash.txt', { type: 'text/plain' });
        formData.append('proof', hashFile);
      }

      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: "Success!",
          description: data.message || "Deposit request submitted successfully",
        });
        // Reset form
        setStep('select-method');
        setSelectedMethod('');
        setSelectedCurrency('');
        setDepositAddress('');
        setDepositAmount('');
        setProofFile(null);
        setTransactionHash('');
      } else {
        throw new Error(data.message || 'Failed to submit deposit');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit deposit request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToStart = () => {
    setStep('select-method');
    setSelectedMethod('');
    setSelectedCurrency('');
    setDepositAddress('');
    setDepositAmount('');
    setProofFile(null);
    setTransactionHash('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {step !== 'select-method' && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (step === 'select-currency') setStep('select-method');
                  else if (step === 'get-address') setStep('select-currency');
                  else if (step === 'upload-proof') setStep('get-address');
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <h1 className="text-3xl font-bold">Crypto Deposit</h1>
          </div>
          <Button variant="outline" onClick={resetToStart}>
            Start Over
          </Button>
        </div>

        {/* Step 1: Select Payment Method */}
        {step === 'select-method' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Select Payment Provider</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(paymentMethods).map(([key, method]) => (
                <Card
                  key={key}
                  className="bg-slate-800 border-slate-700 hover:border-primary cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedMethod(key);
                    setStep('select-currency');
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <img
                      src={method.logo}
                      alt={method.name}
                      className="w-16 h-16 mx-auto mb-4 rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/64x64/6366f1/ffffff?text=${method.name.charAt(0)}`;
                      }}
                    />
                    <h3 className="text-xl font-semibold text-white mb-2">{method.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {method.currencies.length} cryptocurrencies supported
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3 justify-center">
                      {method.currencies.slice(0, 4).map((currency) => (
                        <Badge key={currency} variant="secondary" className="text-xs">
                          {currency}
                        </Badge>
                      ))}
                      {method.currencies.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{method.currencies.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Cryptocurrency */}
        {step === 'select-currency' && selectedMethod && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Select Cryptocurrency</h2>
            <p className="text-gray-400 mb-6">Choose the cryptocurrency you want to deposit via {paymentMethods[selectedMethod].name}</p>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paymentMethods[selectedMethod].currencies.map((currency) => (
                <Card
                  key={currency}
                  className={`bg-slate-800 border-slate-700 hover:border-primary cursor-pointer transition-colors ${
                    selectedCurrency === currency ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedCurrency(currency)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">{currency}</span>
                    </div>
                    <h3 className="font-semibold text-white">{currency}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedCurrency && (
              <div className="mt-8">
                <Button onClick={generateDepositAddress} disabled={loading} className="w-full">
                  {loading ? 'Generating...' : 'Generate Deposit Address'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Get Deposit Address */}
        {step === 'get-address' && depositAddress && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Deposit Address Generated</h2>

            <Card className="bg-slate-800 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Send {selectedCurrency} to this address</span>
                  <Badge variant="secondary">{paymentMethods[selectedMethod].name}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-green-400 break-all">{depositAddress}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(depositAddress)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-400">
                    <span className="text-sm">⚠️</span>
                    <span className="text-sm">Only send {selectedCurrency} to this address</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <span className="text-sm">⚠️</span>
                    <span className="text-sm">Minimum deposit amount may apply</span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <Button
                    onClick={openExternalProvider}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open {paymentMethods[selectedMethod].name}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep('upload-proof')}
                    className="flex-1"
                  >
                    I've Made the Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Upload Proof */}
        {step === 'upload-proof' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Submit Proof of Payment</h2>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Deposit Amount</label>
                    <input
                      type="number"
                      step="0.00000001"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder={`Amount in ${selectedCurrency}`}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Proof of Payment</label>
                    <div className="flex space-x-4 mb-4">
                      <Button
                        variant={proofType === 'file' ? 'default' : 'outline'}
                        onClick={() => setProofType('file')}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                      <Button
                        variant={proofType === 'hash' ? 'default' : 'outline'}
                        onClick={() => setProofType('hash')}
                      >
                        <Hash className="h-4 w-4 mr-2" />
                        Transaction Hash
                      </Button>
                    </div>

                    {proofType === 'file' && (
                      <div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                          Accepted formats: JPG, PNG, PDF (max 10MB)
                        </p>
                      </div>
                    )}

                    {proofType === 'hash' && (
                      <div>
                        <input
                          type="text"
                          value={transactionHash}
                          onChange={(e) => setTransactionHash(e.target.value)}
                          placeholder="Enter transaction hash"
                          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                          Enter the transaction hash from your payment
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-2">What happens next?</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Your deposit will be reviewed by our team</li>
                      <li>• You'll receive a notification once processed</li>
                      <li>• Funds will be added to your wallet upon approval</li>
                      <li>• Processing typically takes 1-24 hours</li>
                    </ul>
                  </div>

                  <Button
                    onClick={submitProof}
                    disabled={loading || !depositAmount || (!proofFile && !transactionHash)}
                    className="w-full"
                  >
                    {loading ? 'Submitting...' : 'Submit Deposit Request'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}